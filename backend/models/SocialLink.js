const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["instagram", "facebook", "tiktok", "x", "youtube", "snapchat", "other"],
      required: true,
      unique: true,
    },
    label: { type: String, default: "" },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SocialLink", socialLinkSchema);
