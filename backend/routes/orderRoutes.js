const express = require("express");
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/auth");
const {
  createPaypalOrder,
  capturePaypalOrder,
  paypalWebhook,
  lookupOrders,
  downloadOrder,
  getAllOrders,
  getSummary,
} = require("../controllers/orderController");

const router = express.Router();

// Routes publiques (aucun acheteur n'est connecte) : limitees pour eviter les abus.
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Trop de tentatives, reessayez dans 15 minutes." },
});
const captureLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Trop de tentatives, reessayez dans 15 minutes." },
});
const lookupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { message: "Trop de tentatives, reessayez plus tard." },
});
const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { message: "Trop de telechargements, reessayez plus tard." },
});

router.post("/create-paypal-order", createLimiter, createPaypalOrder);
router.post("/capture-paypal-order", captureLimiter, capturePaypalOrder);
// Appelee par PayPal lui-meme (verifiee par signature), pas par un navigateur.
router.post("/paypal-webhook", paypalWebhook);
router.post("/lookup", lookupLimiter, lookupOrders);
router.post("/download", downloadLimiter, downloadOrder);

// Admin
router.get("/all", protect, getAllOrders);
router.get("/summary", protect, getSummary);

module.exports = router;
