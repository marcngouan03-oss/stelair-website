require("dotenv").config();
const mongoose = require("mongoose");
const Bio = require("../models/Bio");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connecte a MongoDB pour la migration...");

  const bio = await Bio.findOne({ key: "main" });
  
  if (!bio) {
    console.log("Aucune biographie trouvee.");
    process.exit(0);
  }

  // Si les sections n'existent pas ou sont vides, migrer les anciennes donnees
  if (!bio.sections || bio.sections.length === 0) {
    console.log("Migration des anciennes donnees vers sections...");
    
    bio.sections = [];
    let order = 0;

    // Migrer aboutParagraphs
    if (bio.aboutParagraphs && bio.aboutParagraphs.length > 0) {
      bio.sections.push({
        title: "A propos de moi",
        subtitle: "",
        paragraphs: bio.aboutParagraphs,
        image: bio.portraitImage || "",
        imagePublicId: bio.portraitImagePublicId || "",
        spotifyEmbedId: "",
        spotifyEmbedType: "track",
        order: order++,
      });
    }

    // Migrer musicParagraphs
    if (bio.musicQuote || (bio.musicParagraphs && bio.musicParagraphs.length > 0)) {
      bio.sections.push({
        title: "Ma Musique",
        subtitle: bio.musicQuote || "",
        paragraphs: bio.musicParagraphs || [],
        image: bio.secondaryImage || "",
        imagePublicId: bio.secondaryImagePublicId || "",
        spotifyEmbedId: "",
        spotifyEmbedType: "track",
        order: order++,
      });
    }

    await bio.save();
    console.log(`✓ Migration reussie: ${bio.sections.length} section(s) creee(s)`);
  } else {
    console.log("Les sections existent deja. Aucune migration necessaire.");
  }

  process.exit(0);
};

run().catch(err => {
  console.error("Erreur lors de la migration:", err);
  process.exit(1);
});
