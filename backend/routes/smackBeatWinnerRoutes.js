const buildRouter = require("./routeFactory");
const crudFactory = require("../controllers/crudFactory");
const SmackBeatWinner = require("../models/SmackBeatWinner");

const controller = crudFactory(SmackBeatWinner, { imageFields: ["image"] });

module.exports = buildRouter(controller);