const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stockage centralise dans un seul dossier Cloudinary "stelair" avec sous-dossiers
// pour ne jamais perdre les fichiers apres le deploiement (Cloudinary = source de verite,
// jamais le disque local de Railway/Netlify qui est ephemere).
//
// IMPORTANT : Cloudinary classe les fichiers AUDIO (mp3, wav...) dans la
// categorie "video". C'est sa convention. Donc audio => resource_type "video".
// Les ZIP (packs de sons vendus dans la boutique) utilisent resource_type "raw",
// seule categorie Cloudinary acceptant des fichiers binaires generiques.
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = req.query.folder || "misc";
    const isVideo = file.mimetype.startsWith("video/");
    const isAudio = file.mimetype.startsWith("audio/");
    // Le mimetype d'un zip varie selon navigateur/OS (application/zip,
    // application/x-zip-compressed...), donc on verifie aussi l'extension.
    const isZip =
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed" ||
      /\.zip$/i.test(file.originalname);

    return {
      folder: `stelair/${folder}`,
      // audio ET video utilisent "video" chez Cloudinary, zip utilise "raw"
      resource_type: isVideo || isAudio ? "video" : isZip ? "raw" : "image",
      allowed_formats: [
        "jpg", "jpeg", "png", "webp", "gif",
        "mp4", "mov",
        "mp3", "wav", "ogg", "m4a", "aac", "flac",
        "zip",
      ],
      // pas de transformation pour les videos, audios et zip
      transformation: isVideo || isAudio || isZip
        ? undefined
        : [{ quality: "auto", fetch_format: "auto" }],
    };
  },
});

const upload = multer({
  storage,
  // 300MB max : les packs de sons (zip) sont plus lourds que les images/videos
  // habituelles du site. A ajuster si les packs de l'artiste depassent cette taille.
  limits: { fileSize: 300 * 1024 * 1024 },
});

module.exports = { cloudinary, upload };