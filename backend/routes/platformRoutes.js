const PlatformLink = require("../models/PlatformLink");
const crudFactory = require("../controllers/crudFactory");
const buildRouter = require("./routeFactory");

const controller = crudFactory(PlatformLink, { imageFields: ["logo"] });
module.exports = buildRouter(controller);