const express = require("express");
const { protect } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const { uploadFile } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadFile);

module.exports = router;
