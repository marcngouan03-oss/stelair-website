require("dotenv").config();
process.on("unhandledRejection", (err) => {
  console.error("Erreur non geree (le serveur continue de tourner) :", err.message);
});
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();

// --- Securite / configuration de base ---
app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les outils sans origin (Postman, apps mobiles) et les origines listees
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error("Non autorise par la politique CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Limite le nombre de tentatives de connexion admin pour eviter le brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Trop de tentatives, reessayez dans 15 minutes." },
});
app.use("/api/auth/login", loginLimiter);

// Limite generale sur le formulaire public de collaboration (anti-spam)
const collabLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: { message: "Trop de demandes envoyees. Reessayez plus tard." },
});
app.use("/api/collab", (req, res, next) => (req.method === "POST" ? collabLimiter(req, res, next) : next()));

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ message: "API officielle STELAIR - en ligne." });
});
app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/heroes", require("./routes/heroRoutes"));
app.use("/api/tracks", require("./routes/trackRoutes"));
app.use("/api/videos", require("./routes/videoRoutes"));
app.use("/api/socials", require("./routes/socialRoutes"));
app.use("/api/platforms", require("./routes/platformRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));
app.use("/api/collab", require("./routes/collabRoutes"));
app.use("/api/bio", require("./routes/bioRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/smackbeat", require("./routes/smackBeatRoutes"));
app.use("/api/smackbeat-winners", require("./routes/smackBeatWinnerRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// "0.0.0.0" permet d'exposer le serveur sur le reseau local (pour tester sur telephone)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
==========================================
  STELAIR API demarree
  Local:   http://localhost:${PORT}
  Reseau:  http://<votre-ip-locale>:${PORT}
==========================================
`);
});