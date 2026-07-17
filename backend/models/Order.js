const mongoose = require("mongoose");

// Represente un achat (tentative ou confirme) d'un Beat via PayPal.
// On snapshote les infos du Beat au moment de l'achat (titre, prix, fichier)
// pour ne jamais casser une commande passee si le Beat est modifie/supprime
// ensuite, et pour verifier le montant paye contre une valeur figee (anti-fraude).
const orderSchema = new mongoose.Schema(
  {
    beat: { type: mongoose.Schema.Types.ObjectId, ref: "Beat", required: true },
    beatTitleSnapshot: { type: String, required: true },
    beatZipUrlSnapshot: { type: String, required: true },
    beatZipPublicIdSnapshot: { type: String, default: "" },
    priceEURSnapshot: { type: Number, required: true },

    buyerEmail: { type: String, required: true, trim: true, lowercase: true },

    // Pas "unique" : plusieurs Order (un par pack) peuvent partager le meme
    // paypalOrderId quand l'achat vient d'un panier a plusieurs packs regle
    // en un seul paiement PayPal.
    paypalOrderId: { type: String, required: true, index: true },
    paypalCaptureId: { type: String, default: "" },

    paymentStatus: {
      type: String,
      enum: ["CREATED", "COMPLETED", "FAILED", "CANCELLED"],
      default: "CREATED",
      index: true,
    },

    amountTotalEUR: { type: Number, default: 0 },
    artistShareEUR: { type: Number, default: 0 }, // 70%
    ownerShareEUR: { type: Number, default: 0 }, // 30%
    currency: { type: String, default: "EUR" },

    // Code court et lisible (ex: AB3D-9F2K), genere une seule fois par email et
    // reutilise pour toutes ses commandes suivantes : permet a un acheteur de
    // retrouver TOUS ses achats avec un seul code, sans systeme de compte/email.
    customerAccessCode: { type: String, index: true },

    failureReason: { type: String, default: "" },
    paidAt: { type: Date },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
