const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const asyncHandler = require("../middleware/asyncHandler");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: "Identifiants incorrects." });
  }
  res.json({
    _id: admin._id,
    email: admin.email,
    name: admin.name,
    token: generateToken(admin._id),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json(req.admin);
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id);
  if (!(await admin.comparePassword(currentPassword))) {
    return res.status(400).json({ message: "Mot de passe actuel incorrect." });
  }
  admin.password = newPassword;
  await admin.save();
  res.json({ message: "Mot de passe mis a jour avec succes." });
});

module.exports = { login, getMe, updatePassword };