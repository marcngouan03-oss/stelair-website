const Track = require("../models/Track");
const crudFactory = require("../controllers/crudFactory");
const buildRouter = require("./routeFactory");

const controller = crudFactory(Track, { imageFields: ["coverImage"] });
module.exports = buildRouter(controller);
