const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    youtubeUrl: { type: String, required: true }, // lien complet colle par l'admin
    thumbnail: { type: String, default: "" }, // vignette perso Cloudinary (optionnel)
    thumbnailPublicId: { type: String, default: "" },
    description: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
