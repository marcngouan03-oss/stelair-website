const { cloudinary } = require("../config/cloudinary");
const asyncHandler = require("../middleware/asyncHandler");

const crudFactory = (Model, { imageFields = [] } = {}) => ({
  getAll: asyncHandler(async (req, res) => {
    const items = await Model.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  }),

  getPublic: asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.query.page) filter.page = req.query.page;
    const items = await Model.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(items);
  }),

  getOne: asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Element introuvable." });
    res.json(item);
  }),

  create: asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  }),

  update: asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Element introuvable." });

    for (const field of imageFields) {
      const publicIdField = `${field}PublicId`;
      if (req.body[field] && item[publicIdField] && req.body[field] !== item[field]) {
        try {
          await cloudinary.uploader.destroy(item[publicIdField]);
        } catch (e) {
          console.warn("Nettoyage Cloudinary echoue (ignore) :", e.message);
        }
      }
    }

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  }),

  remove: asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Element introuvable." });

    for (const field of imageFields) {
      const publicIdField = `${field}PublicId`;
      if (item[publicIdField]) {
        try {
          await cloudinary.uploader.destroy(item[publicIdField]);
        } catch (e) {
          console.warn("Nettoyage Cloudinary echoue (ignore) :", e.message);
        }
      }
    }

    await item.deleteOne();
    res.json({ message: "Element supprime avec succes." });
  }),
});

module.exports = crudFactory;