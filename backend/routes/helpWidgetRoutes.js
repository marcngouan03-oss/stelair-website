const express = require("express");
const { protect } = require("../middleware/auth");
const { getHelpWidget, updateHelpWidget } = require("../controllers/helpWidgetController");

const router = express.Router();

router.get("/", getHelpWidget);
router.put("/", protect, updateHelpWidget);

module.exports = router;
