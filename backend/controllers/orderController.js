const mongoose = require("mongoose");
const { Readable } = require("stream");
const Order = require("../models/Order");
const asyncHandler = require("../middleware/asyncHandler");

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
  lookupOrders,
  downloadOrder,
  getAllOrders,
  getSummary,
};
