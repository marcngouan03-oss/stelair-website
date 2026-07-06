const Agent = require("../models/Agent");
const crudFactory = require("../controllers/crudFactory");
const buildRouter = require("./routeFactory");

const controller = crudFactory(Agent, { imageFields: ["photo"] });
module.exports = buildRouter(controller);
