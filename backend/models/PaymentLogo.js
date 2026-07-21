const mongoose = require("mongoose");

// Logos des moyens de paiement affiches sur le site (footer, panier, fiche
// produit). Geres librement depuis l'admin : l'artiste ajoute/retire les
// logos qu'il veut (Visa, Mastercard, Apple Pay, Wave, Orange Money...).
const paymentLogoSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentLogo", paymentLogoSchema);
