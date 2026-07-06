const mongoose = require("mongoose");

// Un "Hero" est un grand bandeau plein ecran (image ou video de fond).
// STELAIR pourra en creer plusieurs et choisir sur quelle page chacun apparait,
// ainsi que leur ordre d'affichage (carousel).
const heroSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      enum: ["home", "music", "videos", "biography", "contact"],
      default: "home",
    },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: "" },
    mediaType: { type: String, enum: ["image", "video"], default: "image" },
    mediaUrl: { type: String, required: true },
    mediaPublicId: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaLink: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", heroSchema);
