const mongoose = require("mongoose");

// Reglages globaux de la boutique (document singleton, meme pattern que SmackBeat).
const shopSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },

    // Logo/badge de confiance affiche sur la page de paiement. Optionnel :
    // si non defini, le logo officiel PayPal est affiche par defaut.
    paymentLogo: { type: String, default: "" },
    paymentLogoPublicId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShopSettings", shopSettingsSchema);
