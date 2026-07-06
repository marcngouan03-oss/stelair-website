const mongoose = require("mongoose");

// Chaque soumission du formulaire "Proposer une collaboration" cote public.
const collabRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    projectType: {
      type: String,
      enum: ["featuring", "booking_concert", "production", "partenariat", "presse", "autre"],
      default: "autre",
    },
    company: { type: String, default: "" },
    message: { type: String, required: true },
    linkToWork: { type: String, default: "" }, // lien vers un extrait/portfolio
    status: {
      type: String,
      enum: ["nouveau", "en_cours", "traite", "archive"],
      default: "nouveau",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CollabRequest", collabRequestSchema);
