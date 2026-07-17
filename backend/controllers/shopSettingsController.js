const ShopSettings = require("../models/ShopSettings");
const { cloudinary } = require("../config/cloudinary");
const asyncHandler = require("../middleware/asyncHandler");

const getShopSettings = asyncHandler(async (req, res) => {
  let settings = await ShopSettings.findOne({ key: "main" });
  if (!settings) settings = await ShopSettings.create({ key: "main" });
  res.json(settings);
});

const updateShopSettings = asyncHandler(async (req, res) => {
  let settings = await ShopSettings.findOne({ key: "main" });
  if (!settings) settings = new ShopSettings({ key: "main" });

  if (
    req.body.paymentLogo &&
    settings.paymentLogoPublicId &&
    req.body.paymentLogo !== settings.paymentLogo
  ) {
    try {
      await cloudinary.uploader.destroy(settings.paymentLogoPublicId, { resource_type: "image" });
    } catch (e) {
      console.warn("Nettoyage Cloudinary echoue (ignore) :", e.message);
    }
  }

  Object.assign(settings, req.body);
  await settings.save();
  res.json(settings);
});

module.exports = { getShopSettings, updateShopSettings };
