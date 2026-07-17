const SmackBeat = require("../models/SmackBeat");
const { cloudinary } = require("../config/cloudinary");
const asyncHandler = require("../middleware/asyncHandler");

const getSmackBeat = asyncHandler(async (req, res) => {
  let sb = await SmackBeat.findOne({ key: "main" });
  if (!sb) {
    sb = await SmackBeat.create({ key: "main" });
  }
  res.json(sb);
});

const updateSmackBeat = asyncHandler(async (req, res) => {
  let sb = await SmackBeat.findOne({ key: "main" });
  if (!sb) sb = new SmackBeat({ key: "main" });

  // Si l'instrumental change, on nettoie l'ancien fichier sur Cloudinary
  if (
    req.body.instrumentalUrl &&
    sb.instrumentalPublicId && 
    req.body.instrumentalUrl !== sb.instrumentalUrl
  ) {
    try {
      await cloudinary.uploader.destroy(sb.instrumentalPublicId, { resource_type: "video" });
    } catch (e) {
      console.warn("Nettoyage Cloudinary echoue (ignore) :", e.message);
    }
  }

  Object.assign(sb, req.body);
  await sb.save();
  res.json(sb);
});

module.exports = { getSmackBeat, updateSmackBeat };