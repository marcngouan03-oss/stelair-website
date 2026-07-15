const mongoose = require("mongoose");

// Un item = une actualite/annonce affichee quand on ouvre le bouton
// (ex: "Nouveau concours SmackBeat dans 2 mois" avec un lien vers /smackbeat).
const announcementSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
    link: { type: String, default: "" },
    linkLabel: { type: String, default: "" },
  },
  { _id: false }
);

// Bouton flottant "Besoin d'aide ?" affichable sur le site public.
// STELAIR l'active/desactive et change son texte + ses actualites depuis l'admin,
// sans jamais toucher au code.
const helpWidgetSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    isActive: { type: Boolean, default: false },
    buttonLabel: { type: String, default: "Besoin d'aide ?" },
    items: { type: [announcementSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HelpWidget", helpWidgetSchema);
