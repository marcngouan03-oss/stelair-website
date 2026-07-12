const mongoose = require("mongoose");

const smackBeatSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },

    rulesText: { type: String, default: "" }, // texte des regles du challenge
    prizeText: { type: String, default: "" }, // texte des prix a gagner (change chaque mois)

    instrumentalUrl: { type: String, default: "" }, // fichier audio Cloudinary
    instrumentalPublicId: { type: String, default: "" },

    studioName: { type: String, default: "Studio Agri" },
    studioPhone: { type: String, default: "" }, // numero cliquable (tel:)

    tiktokInstructions: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SmackBeat", smackBeatSchema);