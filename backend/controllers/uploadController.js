// @route POST /api/upload  (admin) - champ "file", query ?folder=heroes|tracks|videos|agents|bio
const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier recu." });
  }
  res.status(201).json({
    url: req.file.path, // URL Cloudinary securisee (https)
    publicId: req.file.filename, // public_id Cloudinary, utile pour suppression future
  });
};

module.exports = { uploadFile };
