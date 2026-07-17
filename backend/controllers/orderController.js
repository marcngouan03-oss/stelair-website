const crypto = require("crypto");
const mongoose = require("mongoose");
const { Readable } = require("stream");
const Beat = require("../models/Beat");
const Order = require("../models/Order");
const asyncHandler = require("../middleware/asyncHandler");
const paypal = require("../utils/paypal");

const ARTIST_SHARE = 0.7;
const OWNER_SHARE = 0.3;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Alphabet sans caracteres ambigus (pas de 0/O, 1/I/L) pour un code facile a recopier a la main.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateAccessCode() {
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

// Un meme email garde toujours le meme code, sur toutes ses commandes : ca lui
// permet de retrouver tous ses achats avec un seul code, sans systeme de compte.
async function getOrCreateAccessCode(buyerEmail) {
  const previous = await Order.findOne({
    buyerEmail,
    customerAccessCode: { $exists: true, $ne: null },
  }).sort({ createdAt: -1 });
  if (previous && previous.customerAccessCode) return previous.customerAccessCode;
  return generateAccessCode();
}

// Marque une commande comme payee et calcule le split 70/30. Idempotent :
// appelable a la fois depuis la capture synchrone et depuis le webhook,
// sans jamais compter une meme vente deux fois.
async function markOrderCompleted(order, paypalCaptureId) {
  if (order.paymentStatus === "COMPLETED") return order;

  const amount = order.priceEURSnapshot;
  order.paymentStatus = "COMPLETED";
  order.paypalCaptureId = paypalCaptureId || order.paypalCaptureId;
  order.amountTotalEUR = amount;
  order.artistShareEUR = Math.round(amount * ARTIST_SHARE * 100) / 100;
  order.ownerShareEUR = Math.round(amount * OWNER_SHARE * 100) / 100;
  order.paidAt = new Date();
  order.customerAccessCode = await getOrCreateAccessCode(order.buyerEmail);
  await order.save();

  await Beat.findByIdAndUpdate(order.beat, { $inc: { salesCount: 1 } });
  return order;
}

// @route POST /api/orders/create-paypal-order (public)
// Recoit un panier (plusieurs packs possibles) et ne recoit JAMAIS de montant
// du client : le prix de chaque pack vient uniquement des Beat en base.
const createPaypalOrder = asyncHandler(async (req, res) => {
  const { buyerEmail } = req.body;
  const beatIds = Array.isArray(req.body.beatIds)
    ? req.body.beatIds
    : req.body.beatId
    ? [req.body.beatId]
    : [];

  if (beatIds.length === 0 || beatIds.some((id) => !mongoose.isValidObjectId(id))) {
    return res.status(400).json({ message: "Panier invalide." });
  }
  if (!buyerEmail || !EMAIL_RE.test(buyerEmail)) {
    return res.status(400).json({ message: "Adresse email invalide." });
  }

  const beats = await Beat.find({ _id: { $in: beatIds }, isActive: true });
  if (beats.length !== new Set(beatIds.map(String)).size) {
    return res.status(404).json({ message: "Un ou plusieurs packs ne sont plus disponibles." });
  }
  const unavailable = beats.find((b) => !b.zipUrl);
  if (unavailable) {
    return res.status(409).json({
      message: `Le pack "${unavailable.title}" n'est pas encore disponible au telechargement.`,
    });
  }

  const email = buyerEmail.trim().toLowerCase();
  const groupKey = new mongoose.Types.ObjectId();

  const orders = await Order.create(
    beats.map((beat) => ({
      beat: beat._id,
      beatTitleSnapshot: beat.title,
      beatZipUrlSnapshot: beat.zipUrl,
      beatZipPublicIdSnapshot: beat.zipUrlPublicId,
      priceEURSnapshot: beat.price,
      buyerEmail: email,
      // Placeholder en attendant l'id PayPal reel (partage par tous les items du panier).
      paypalOrderId: `PENDING-${groupKey}-${beat._id}`,
      ipAddress: req.ip,
    }))
  );

  const total = beats.reduce((sum, b) => sum + b.price, 0);
  const orderIds = orders.map((o) => o._id);

  try {
    const paypalOrder = await paypal.createPaypalOrder({
      amountEUR: total,
      description: beats.length === 1 ? beats[0].title : `${beats.length} packs STELAIR`,
      requestId: groupKey,
    });

    await Order.updateMany({ _id: { $in: orderIds } }, { $set: { paypalOrderId: paypalOrder.id } });
    res.status(201).json({ paypalOrderId: paypalOrder.id });
  } catch (err) {
    await Order.updateMany(
      { _id: { $in: orderIds } },
      { $set: { paymentStatus: "FAILED", failureReason: err.message } }
    );
    res.status(502).json({ message: "Impossible de contacter PayPal pour le moment." });
  }
});

// @route POST /api/orders/capture-paypal-order (public)
// Verifie TOUJOURS aupres de PayPal (jamais dans le corps de la requete client)
// que le paiement est bien confirme et que le montant correspond exactement
// (somme des prix de TOUS les packs du panier, recalculee cote serveur).
const capturePaypalOrder = asyncHandler(async (req, res) => {
  const { paypalOrderId } = req.body;
  if (!paypalOrderId) {
    return res.status(400).json({ message: "Commande PayPal manquante." });
  }

  const orders = await Order.find({ paypalOrderId });
  if (orders.length === 0) {
    return res.status(404).json({ message: "Commande introuvable." });
  }

  const toItems = (list) => list.map((o) => ({ orderId: o._id, beatTitle: o.beatTitleSnapshot }));

  if (orders.every((o) => o.paymentStatus === "COMPLETED")) {
    return res.json({ success: true, accessCode: orders[0].customerAccessCode, items: toItems(orders) });
  }

  const capture = await paypal.capturePaypalOrder(paypalOrderId, orders[0]._id);

  if (!capture.ok) {
    await Order.updateMany(
      { _id: { $in: orders.map((o) => o._id) } },
      { $set: { paymentStatus: "FAILED", failureReason: capture.data?.message || "Paiement refuse par PayPal." } }
    );
    return res.status(422).json({ message: "Le paiement n'a pas pu etre confirme." });
  }

  const data = capture.data;
  const captureNode = data?.purchase_units?.[0]?.payments?.captures?.[0];
  const expectedTotal = orders.reduce((sum, o) => sum + o.priceEURSnapshot, 0);

  const statusOk = data?.status === "COMPLETED" && captureNode?.status === "COMPLETED";
  const amountOk = captureNode?.amount?.value === expectedTotal.toFixed(2);
  const currencyOk = captureNode?.amount?.currency_code === "EUR";

  if (!statusOk || !amountOk || !currencyOk) {
    console.error("Verification de capture PayPal echouee pour la commande", paypalOrderId);
    await Order.updateMany(
      { _id: { $in: orders.map((o) => o._id) } },
      { $set: { paymentStatus: "FAILED", failureReason: "Verification du paiement echouee." } }
    );
    return res.status(500).json({ message: "Erreur de verification du paiement. Contactez le support." });
  }

  for (const order of orders) {
    await markOrderCompleted(order, captureNode.id);
  }

  res.json({ success: true, accessCode: orders[0].customerAccessCode, items: toItems(orders) });
});

// @route POST /api/orders/paypal-webhook (public, verifie par signature PayPal)
// Filet de securite : recolle une vente si la capture synchrone n'a jamais
// atteint le serveur (ex: le client ferme l'onglet juste apres avoir paye).
const paypalWebhook = asyncHandler(async (req, res) => {
  const verified = await paypal.verifyWebhookSignature(req.headers, req.body);
  if (!verified) {
    return res.status(400).json({ message: "Signature webhook invalide." });
  }

  const event = req.body;
  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const resource = event.resource || {};
    const relatedOrderId = resource?.supplementary_data?.related_ids?.order_id;

    if (relatedOrderId) {
      const orders = await Order.find({ paypalOrderId: relatedOrderId });
      const pending = orders.filter((o) => o.paymentStatus !== "COMPLETED");
      if (pending.length > 0) {
        const expectedTotal = orders.reduce((sum, o) => sum + o.priceEURSnapshot, 0);
        const amountOk = resource.amount?.value === expectedTotal.toFixed(2);
        if (amountOk) {
          for (const order of pending) {
            await markOrderCompleted(order, resource.id);
          }
        } else {
          console.error("Webhook PayPal : montant incoherent pour la commande", relatedOrderId);
        }
      }
    }
  }

  res.status(200).json({ received: true });
});

// @route POST /api/orders/lookup (public) - "espace client"
const lookupOrders = asyncHandler(async (req, res) => {
  const { email, accessCode } = req.body;
  if (!email || !accessCode) {
    return res.status(400).json({ message: "Email et code requis." });
  }
  const buyerEmail = email.trim().toLowerCase();

  const proof = await Order.findOne({
    buyerEmail,
    customerAccessCode: accessCode.trim().toUpperCase(),
    paymentStatus: "COMPLETED",
  });
  if (!proof) {
    return res.status(404).json({ message: "Aucun achat trouve avec cet email et ce code." });
  }

  const orders = await Order.find({ buyerEmail, paymentStatus: "COMPLETED" }).sort({ createdAt: -1 });
  res.json(
    orders.map((o) => ({
      id: o._id,
      beatTitle: o.beatTitleSnapshot,
      amount: o.amountTotalEUR,
      purchasedAt: o.paidAt,
    }))
  );
});

// @route POST /api/orders/download (public) - proxy de telechargement securise
// Le vrai lien Cloudinary ne transite jamais dans le navigateur du client.
const downloadOrder = asyncHandler(async (req, res) => {
  const { email, accessCode, orderId } = req.body;
  if (!email || !accessCode || !orderId || !mongoose.isValidObjectId(orderId)) {
    return res.status(400).json({ message: "Requete invalide." });
  }

  const order = await Order.findOne({
    _id: orderId,
    buyerEmail: email.trim().toLowerCase(),
    customerAccessCode: accessCode.trim().toUpperCase(),
    paymentStatus: "COMPLETED",
  });
  if (!order) {
    return res.status(404).json({ message: "Achat introuvable ou code invalide." });
  }

  const upstream = await fetch(order.beatZipUrlSnapshot);
  if (!upstream.ok || !upstream.body) {
    return res.status(502).json({ message: "Fichier indisponible, contactez le support." });
  }

  const safeName = order.beatTitleSnapshot.replace(/[^a-z0-9\-_ ]/gi, "_") || "pack";
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${safeName}.zip"`);
  const len = upstream.headers.get("content-length");
  if (len) res.setHeader("Content-Length", len);

  Readable.fromWeb(upstream.body).pipe(res);
});

// --- Admin (proteges) ---

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

const getSummary = asyncHandler(async (req, res) => {
  const [agg] = await Order.aggregate([
    { $match: { paymentStatus: "COMPLETED" } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenueEUR: { $sum: "$amountTotalEUR" },
        totalArtistShareEUR: { $sum: "$artistShareEUR" },
        totalOwnerShareEUR: { $sum: "$ownerShareEUR" },
      },
    },
  ]);
  res.json(
    agg || { totalOrders: 0, totalRevenueEUR: 0, totalArtistShareEUR: 0, totalOwnerShareEUR: 0 }
  );
});

module.exports = {
  createPaypalOrder,
  capturePaypalOrder,
  paypalWebhook,
  lookupOrders,
  downloadOrder,
  getAllOrders,
  getSummary,
};
