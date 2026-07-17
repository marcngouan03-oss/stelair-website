const express = require("express");
const { protect } = require("../middleware/auth");
const { getShopSettings, updateShopSettings } = require("../controllers/shopSettingsController");

const router = express.Router();

router.get("/", getShopSettings); // public (lu par la page de paiement)
router.put("/", protect, updateShopSettings); // admin

module.exports = router;
