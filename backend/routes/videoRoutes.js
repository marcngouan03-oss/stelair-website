const Video = require("../models/Video");
const crudFactory = require("../controllers/crudFactory");
const buildRouter = require("./routeFactory");

const controller = crudFactory(Video, { imageFields: ["thumbnail"] });
module.exports = buildRouter(controller);
