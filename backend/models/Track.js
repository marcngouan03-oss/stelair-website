const mongoose = require("mongoose");

// Represente un titre / album / playlist a ecouter directement sur le site.
// "embedUrl" est deduit automatiquement du lien colle dans la page admin
// (voir utils/embedHelpers.js sur le frontend), donc STELAIR n'a qu'a coller
// son lien Spotify/Deezer/SoundCloud et tout se genere seul.
const trackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["track", "album", "playlist", "artist"],
      default: "track",
    },
    platform: {
      type: String,
      enum: ["spotify", "deezer", "soundcloud", "apple", "other"],
      default: "spotify",
    },
    sourceUrl: { type: String, required: true }, // lien original colle par l'admin
    coverImage: { type: String, default: "" }, // image Cloudinary ajoutee par l'admin
    coverImagePublicId: { type: String, default: "" },
    description: { type: String, default: "" },
    featured: { type: Boolean, default: false }, // mis en avant dans le hero d'ecoute
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Track", trackSchema);
