require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Bio = require("../models/Bio");
const SocialLink = require("../models/SocialLink");
const PlatformLink = require("../models/PlatformLink");
const Agent = require("../models/Agent");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connecte a MongoDB pour l'initialisation...");

  // --- Compte admin ---
  const email = (process.env.ADMIN_EMAIL || "admin@stelair.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMoiMaintenant123!";
  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    await Admin.create({ email, password, name: "STELAIR Admin" });
    console.log(`Compte admin cree : ${email}`);
  } else {
    const passwordMatches = await existingAdmin.comparePassword(password);
    if (!passwordMatches) {
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log(`Mot de passe admin mis a jour pour : ${email}`);
    } else {
      console.log("Un compte admin existe deja, aucune modification.");
    }
  }

  // --- Biographie de depart (le texte fourni par STELAIR) ---
  const existingBio = await Bio.findOne({ key: "main" });
  if (!existingBio) {
    await Bio.create({
      key: "main",
      realName: "ANOU SEM FELIX VIRGILE",
      birthDate: "31 juillet 1993",
      birthPlace: "Treichville, Cote d'Ivoire",
      sections: [
        {
          title: "Les debuts musicaux",
          subtitle: "Depuis 2007",
          paragraphs: [
            "STELAIR, de son vrai nom ANOU SEM FELIX VIRGILE est un artiste, auteur, compositeur ne le 31 juillet 1993 a Treichville en Cote d'Ivoire.",
            "Il fait ses premiers pas dans la musique en 2007 et apprend la programmation musicale de maniere autodidacte.",
          ],
          order: 0,
        },
        {
          title: "Formation et education",
          subtitle: "Institut SAE et etudes musicales",
          paragraphs: [
            "En 2010, il quitte l'ecole generale pour integrer l'INSAAC ou il obtient son BAC musical H2. Il poursuit ensuite ses etudes en ingenierie du son a l'Institut SAE de Dubai en 2013.",
          ],
          order: 1,
        },
        {
          title: "Le succes arrive",
          subtitle: "Generation Chilley et les grands hits",
          paragraphs: [
            "De retour a Abidjan en 2015, il travaille en tant qu'arrangeur sur le morceau \"Approchez Regardez\" de DJ Arafat et Kiff No Beat.",
            "C'est en 2016 qu'il connait un immense succes avec son premier single intitule \"Generation Chilley\", en collaboration avec le groupe Kiff No Beat.",
            "STELAIR se fait connaitre grace aux titres \"Faut Parler\" et \"Trop Tard\". Il connait ensuite un autre enorme succes avec le titre \"Eh Bebe\".",
          ],
          order: 2,
        },
        {
          title: "Artiste accompli",
          subtitle: "Une riche palette musicale",
          paragraphs: [
            "Stelair est un rappeur polyvalent qui est un veritable cameleon musical, fusionnant habilement les sonorites afro avec des paroles loves, des flows rap percutants et des rythmes drill entrainants.",
            "STELAIR est aujourd'hui un artiste accompli et respecte dans le milieu musical, qui a su se faire un nom grace a son talent et a son travail acharne.",
          ],
          order: 3,
        },
      ],
    });
    console.log("Biographie initiale creee avec sections.");
  } else {
    // Migration: convertir les anciennes donnees en sections si necessaire
    if (!existingBio.sections || existingBio.sections.length === 0) {
      const newSections = [];
      if (existingBio.aboutParagraphs && existingBio.aboutParagraphs.length > 0) {
        newSections.push({
          title: "A propos de moi",
          subtitle: "",
          paragraphs: existingBio.aboutParagraphs,
          image: existingBio.portraitImage || "",
          imagePublicId: existingBio.portraitImagePublicId || "",
          order: 0,
        });
      }
      if (existingBio.musicQuote || (existingBio.musicParagraphs && existingBio.musicParagraphs.length > 0)) {
        newSections.push({
          title: "Ma Musique",
          subtitle: existingBio.musicQuote || "",
          paragraphs: existingBio.musicParagraphs || [],
          image: existingBio.secondaryImage || "",
          imagePublicId: existingBio.secondaryImagePublicId || "",
          order: 1,
        });
      }
      if (newSections.length > 0) {
        existingBio.sections = newSections;
        await existingBio.save();
        console.log("Donnees biographie migrees vers le nouveau format sections.");
      }
    }
  }

  // --- Reseaux sociaux ---
  const socials = [
    { platform: "instagram", url: "https://www.instagram.com/stelair_beatz/", order: 1 },
    { platform: "facebook", url: "https://www.facebook.com/stelair/", order: 2 },
    { platform: "tiktok", url: "https://www.tiktok.com/@stelair_beatz", order: 3 },
    { platform: "x", url: "https://x.com/stelair_beatz", order: 4 },
  ];
  for (const s of socials) {
    await SocialLink.updateOne({ platform: s.platform }, { $setOnInsert: s }, { upsert: true });
  }
  console.log("Liens reseaux sociaux initialises.");

  // --- Plateformes de streaming ---
  const platforms = [
    {
      platform: "spotify",
      url: "https://open.spotify.com/intl-fr/artist/13JA5UadZYfANIKzGJjc5J",
      order: 1,
    },
    { platform: "apple", url: "https://music.apple.com/fr/artist/stelair/1151365466", order: 2 },
    { platform: "soundcloud", url: "https://soundcloud.com/stelair", order: 3 },
    { platform: "deezer", url: "https://www.deezer.com/fr/artist/10971254", order: 4 },
  ];
  for (const p of platforms) {
    await PlatformLink.updateOne({ platform: p.platform }, { $setOnInsert: p }, { upsert: true });
  }
  console.log("Liens plateformes de streaming initialises.");

  // --- Agents / contacts ---
  const agentCount = await Agent.countDocuments();
  if (agentCount === 0) {
    await Agent.insertMany([
      { name: "Mariah Shalley", role: "Agent", email: "mariahshalley@gmail.com", order: 1 },
      { name: "Yohann", role: "Agent - MCP Group", email: "yohann@mcpgroup.fr", order: 2 },
    ]);
    console.log("Contacts agents initiaux crees.");
  }

  console.log("Initialisation terminee avec succes.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Erreur lors de l'initialisation :", err);
  process.exit(1);
});
