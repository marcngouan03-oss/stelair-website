const mongoose = require("mongoose");

const platformLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["spotify", "apple", "soundcloud", "deezer", "youtubemusic", "tidal", "other"],
      required: true,
      unique: true,
    },
    label: { type: String, default: "" },
    url: { type: String, required: true },
    logo: { type: String, default: "" },
    logoPublicId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlatformLink", platformLinkSchema);