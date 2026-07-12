const express = require("express");
const { protect } = require("../middleware/auth");
const { getSmackBeat, updateSmackBeat } = require("../controllers/smackBeatController");

const router = express.Router();

router.get("/", getSmackBeat);
router.put("/", protect, updateSmackBeat);

module.exports = router;