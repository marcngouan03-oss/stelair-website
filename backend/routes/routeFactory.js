const express = require("express");
const { protect } = require("../middleware/auth");

// Cree un routeur standard :
//  GET    /            -> public, uniquement isActive=true (+filtre ?page= si fourni)
//  GET    /all         -> prive, tout (y compris inactifs) pour la page admin
//  GET    /:id         -> prive, un seul element
//  POST   /            -> prive, creation
//  PUT    /:id         -> prive, modification
//  DELETE /:id         -> prive, suppression
const buildRouter = (controller) => {
  const router = express.Router();

  router.get("/", controller.getPublic);
  router.get("/all", protect, controller.getAll);
  router.get("/:id", protect, controller.getOne);
  router.post("/", protect, controller.create);
  router.put("/:id", protect, controller.update);
  router.delete("/:id", protect, controller.remove);

  return router;
};

module.exports = buildRouter;
