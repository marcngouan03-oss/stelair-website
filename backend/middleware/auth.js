const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Non autorise. Connectez-vous." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Compte administrateur introuvable." });
    }
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session invalide ou expiree, reconnectez-vous." });
  }
};

module.exports = { protect };
