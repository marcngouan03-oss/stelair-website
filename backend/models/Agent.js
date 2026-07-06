const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "Agent" }, // ex: "Booking", "Management", "Presse"
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    photo: { type: String, default: "" },
    photoPublicId: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", agentSchema);
