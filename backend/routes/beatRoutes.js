const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getPublic,
  getPublicOne,
  getAll,
  create,
  update,
  remove,
} = require("../controllers/beatController");

const router = express.Router();

router.get("/", getPublic); // public, sans zipUrl/zipPublicId
router.get("/all", protect, getAll); // admin, avec zipUrl/zipPublicId
router.get("/:id", getPublicOne); // public, sans zipUrl/zipPublicId (fiche produit)
router.post("/", protect, create);
router.put("/:id", protect, update);
router.delete("/:id", protect, remove);

module.exports = router;
