const mongoose = require("mongoose");

// Represente un pack de sons/instrus en vente dans la boutique (fichier ZIP).
// IMPORTANT : zipUrl/zipPublicId ne doivent JAMAIS etre renvoyes par les routes
// publiques (voir beatController.getPublic/getPublicOne) pour empecher un
// telechargement gratuit avant paiement.
const beatSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    coverImage: { type: String, default: "" },
    coverImagePublicId: { type: String, default: "" },

    zipUrl: { type: String, default: "" },
    zipUrlPublicId: { type: String, default: "" },

    // Extrait audio de quelques secondes, public (contrairement au zip) : ecoutable
    // avant achat pour donner envie, sans jamais donner le fichier complet.
    previewAudioUrl: { type: String, default: "" },
    previewAudioUrlPublicId: { type: String, default: "" },

    price: { type: Number, default: 55 },

    // Met en avant un son "devenu populaire" pour le marketing sur la page boutique
    isPopular: { type: Boolean, default: false },

    salesCount: { type: Number, default: 0 },

    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Beat", beatSchema);
