const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// Route TEMPORAIRE pour creer/mettre a jour le compte admin sans acces terminal.
// Visite une seule fois : https://TON-BACKEND.up.railway.app/api/temp-seed?secret=CHANGEZ_MOI
// SUPPRIME ce fichier et sa ligne dans server.js juste apres usage.

router.get("/", async (req, res) => {
  const SECRET = "railste4485-setup"; // secret unique, different du mot de passe admin

  if (req.query.secret !== SECRET) {
    return res.status(403).json({ error: "Secret invalide." });
  }

  try {
    // Supprime un vieil index unique residuel sur "username" (n'existe plus dans le schema actuel)
    try {
      await Admin.collection.dropIndex("username_1");
      console.log("Ancien index username_1 supprime.");
    } catch (idxErr) {
      // Pas grave si l'index n'existe pas ou a deja ete supprime
      console.log("Pas d'index username_1 a supprimer (ou deja supprime).");
    }

    const email = "realbox@gmail.com";
    const password = "railste4485";

    let admin = await Admin.findOne({ email });

    if (admin) {
      admin.password = password; // sera re-hashe automatiquement par le hook pre-save
      await admin.save();
      return res.json({ message: `Mot de passe mis a jour pour ${email}` });
    }

    admin = await Admin.create({ email, password, name: "STELAIR Admin" });
    return res.json({ message: `Compte admin cree : ${email}` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;