const Hero = require("../models/Hero");
const crudFactory = require("../controllers/crudFactory");
const buildRouter = require("./routeFactory");

const controller = crudFactory(Hero, { imageFields: ["mediaUrl"] });
module.exports = buildRouter(controller);
