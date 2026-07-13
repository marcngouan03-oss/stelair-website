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
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = req.query.folder || "misc";
    const isVideo = file.mimetype.startsWith("video/");
    const isAudio = file.mimetype.startsWith("audio/");

    return {
      folder: `stelair/${folder}`,
      // audio ET video utilisent "video" chez Cloudinary
      resource_type: isVideo || isAudio ? "video" : "image",
      allowed_formats: [
        "jpg", "jpeg", "png", "webp", "gif",
        "mp4", "mov",
        "mp3", "wav", "ogg", "m4a", "aac", "flac",
      ],
      // pas de transformation pour les videos et les audios
      transformation: isVideo || isAudio
        ? undefined
        : [{ quality: "auto", fetch_format: "auto" }],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

module.exports = { cloudinary, upload };