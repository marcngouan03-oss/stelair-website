const SocialLink = require("../models/SocialLink");
const crudFactory = require("../controllers/crudFactory");
const buildRouter = require("./routeFactory");

const controller = crudFactory(SocialLink);
module.exports = buildRouter(controller);
