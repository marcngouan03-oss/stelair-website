const mongoose = require("mongoose");

const studioSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    contact: { type: String, default: "" },
  },
  { _id: false }
);

const smackBeatSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },

    tagline: { type: String, default: "fait le challenge et remporte des prix" },

    conceptImage: { type: String, default: "" },
    conceptImagePublicId: { type: String, default: "" },

    heroImage: { type: String, default: "" },
    heroImagePublicId: { type: String, default: "" },

    tiktokIcon: { type: String, default: "" },
    tiktokIconPublicId: { type: String, default: "" },

    instrumentalUrl: { type: String, default: "" },
    instrumentalPublicId: { type: String, default: "" },

    reprisesGoal: { type: Number, default: 4000 },

    studios: { type: [studioSchema], default: [] },

    prizeAmount: { type: String, default: "200 000" },
    clipCredit: { type: String, default: "un clip produit par KUMA.group" },

    tiktokInstructions: { type: String, default: "" },
    rulesText: { type: String, default: "" },
    prizeText: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SmackBeat", smackBeatSchema);