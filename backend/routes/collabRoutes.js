const express = require("express");
const { protect } = require("../middleware/auth");
const {
  submitCollab,
  getAllCollabs,
  updateCollabStatus,
  deleteCollab,
} = require("../controllers/collabController");

const router = express.Router();

router.post("/", submitCollab); // public
router.get("/", protect, getAllCollabs); // admin
router.put("/:id", protect, updateCollabStatus); // admin
router.delete("/:id", protect, deleteCollab); // admin

module.exports = router;
