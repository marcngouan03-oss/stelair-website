const Bio = require("../models/Bio");
const asyncHandler = require("../middleware/asyncHandler");

const getBio = asyncHandler(async (req, res) => {
  let bio = await Bio.findOne({ key: "main" });
  if (!bio) {
    bio = await Bio.create({ key: "main" });
  }
  res.json(bio);
});

const updateBio = asyncHandler(async (req, res) => {
  let bio = await Bio.findOne({ key: "main" });
  if (!bio) bio = new Bio({ key: "main" });
  Object.assign(bio, req.body);
  await bio.save();
  res.json(bio);
});

module.exports = { getBio, updateBio };