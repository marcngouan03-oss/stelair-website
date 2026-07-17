const Beat = require("../models/Beat");
const { cloudinary } = require("../config/cloudinary");
const asyncHandler = require("../middleware/asyncHandler");

// IMPORTANT : les routes publiques ci-dessous excluent TOUJOURS zipUrl/zipUrlPublicId.
// Le fichier vendu ne doit jamais etre accessible avant un paiement confirme
// (voir orderController pour le telechargement securise post-achat).

const getPublic = asyncHandler(async (req, res) => {
  const beats = await Beat.find({ isActive: true })
    .select("-zipUrl -zipUrlPublicId")
    .sort({ order: 1, createdAt: -1 });
  res.json(beats);
});

const getPublicOne = asyncHandler(async (req, res) => {
  const beat = await Beat.findOne({ _id: req.params.id, isActive: true }).select(
    "-zipUrl -zipUrlPublicId"
  );
  if (!beat) return res.status(404).json({ message: "Son introuvable." });
  res.json(beat);
});

// --- Routes admin (protegees) : voient tout, y compris le fichier zip ---

const getAll = asyncHandler(async (req, res) => {
  const beats = await Beat.find().sort({ order: 1, createdAt: -1 });
  res.json(beats);
});

const create = asyncHandler(async (req, res) => {
  const beat = await Beat.create(req.body);
  res.status(201).json(beat);
});

const update = asyncHandler(async (req, res) => {
  const beat = await Beat.findById(req.params.id);
  if (!beat) return res.status(404).json({ message: "Son introuvable." });

  // Nettoyage Cloudinary si la pochette ou le zip sont remplaces.
  if (
    req.body.coverImage &&
    beat.coverImagePublicId &&
    req.body.coverImage !== beat.coverImage
  ) {
    try {
      await cloudinary.uploader.destroy(beat.coverImagePublicId, { resource_type: "image" });
    } catch (e) {
      console.warn("Nettoyage Cloudinary echoue (ignore) :", e.message);
    }
  }
  if (req.body.zipUrl && beat.zipUrlPublicId && req.body.zipUrl !== beat.zipUrl) {
    try {
      await cloudinary.uploader.destroy(beat.zipUrlPublicId, { resource_type: "raw" });
    } catch (e) {
      console.warn("Nettoyage Cloudinary echoue (ignore) :", e.message);
    }
  }
  if (
    req.body.previewAudioUrl &&
    beat.previewAudioUrlPublicId &&
    req.body.previewAudioUrl !== beat.previewAudioUrl
  ) {
    try {
      await cloudinary.uploader.destroy(beat.previewAudioUrlPublicId, { resource_type: "video" });
    } catch (e) {
      console.warn("Nettoyage Cloudinary echoue (ignore) :", e.message);
    }
  }

  Object.assign(beat, req.body);
  await beat.save();
  res.json(beat);
});

const remove = asyncHandler(async (req, res) => {
  const beat = await Beat.findById(req.params.id);
  if (!beat) return res.status(404).json({ message: "Son introuvable." });

  if (beat.coverImagePublicId) {
    try {
      await cloudinary.uploader.destroy(beat.coverImagePublicId, { resource_type: "image" });
    } catch (e) {
      console.warn("Nettoyage Cloudinary echoue (ignore) :", e.message);
    }
  }
  if (beat.zipUrlPublicId) {
    try {
      await cloudinary.uploader.destroy(beat.zipUrlPublicId, { resource_type: "raw" });
    } catch (e) {
      console.warn("Nettoyage Cloudinary echoue (ignore) :", e.message);
    }
  }
  if (beat.previewAudioUrlPublicId) {
    try {
      await cloudinary.uploader.destroy(beat.previewAudioUrlPublicId, { resource_type: "video" });
    } catch (e) {
      console.warn("Nettoyage Cloudinary echoue (ignore) :", e.message);
    }
  }

  await beat.deleteOne();
  res.json({ message: "Son supprime avec succes." });
});

module.exports = { getPublic, getPublicOne, getAll, create, update, remove };
