const express = require("express");
const { protect } = require("../middleware/auth");
const { getBio, updateBio } = require("../controllers/bioController");

const router = express.Router();

router.get("/", getBio); // public
router.put("/", protect, updateBio); // admin

module.exports = router;
