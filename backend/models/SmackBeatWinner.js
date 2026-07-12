const mongoose = require("mongoose");

const smackBeatWinnerSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    winnerName: { type: String, required: true },
    tiktokUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SmackBeatWinner", smackBeatWinnerSchema);