const mongoose = require("mongoose");

// Un "bloc" de biographie, comme sur le site de Tiakola : un titre, un texte,
// une image (a gauche ou a droite), et en option des chiffres de vente / une
// certification / un album Spotify integre.
const bioSectionSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    imagePosition: { type: String, enum: ["left", "right"], default: "right" },
    stat: { type: String, default: "" },
    certification: { type: String, default: "" },
    spotifyUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const bioSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    realName: { type: String, default: "ANOU SEM FELIX VIRGILE" },
    birthDate: { type: String, default: "31 juillet 1993" },
    birthPlace: { type: String, default: "Treichville, Cote d'Ivoire" },
    pageTitle: { type: String, default: "STELAIR : biographie, parcours et actualites" },
    pageSubtitle: {
      type: String,
      default: "Decouvrez le parcours, les origines et la musique de l'artiste ivoirien",
    },
    introText: { type: String, default: "" },
    introImage: { type: String, default: "" },
    introImagePublicId: { type: String, default: "" },
    musicQuote: { type: String, default: "Les langues mentent, seule l'action dit la verite" },
    sections: { type: [bioSectionSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bio", bioSchema);