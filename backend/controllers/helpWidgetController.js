const HelpWidget = require("../models/HelpWidget");
const asyncHandler = require("../middleware/asyncHandler");

const getHelpWidget = asyncHandler(async (req, res) => {
  let hw = await HelpWidget.findOne({ key: "main" });
  if (!hw) {
    hw = await HelpWidget.create({ key: "main" });
  }
  res.json(hw);
});

const updateHelpWidget = asyncHandler(async (req, res) => {
  let hw = await HelpWidget.findOne({ key: "main" });
  if (!hw) hw = new HelpWidget({ key: "main" });

  Object.assign(hw, req.body);
  await hw.save();
  res.json(hw);
});

module.exports = { getHelpWidget, updateHelpWidget };
