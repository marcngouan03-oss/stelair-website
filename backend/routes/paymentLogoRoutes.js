const PaymentLogo = require("../models/PaymentLogo");
const crudFactory = require("../controllers/crudFactory");
const buildRouter = require("./routeFactory");

const controller = crudFactory(PaymentLogo, { imageFields: ["image"] });
module.exports = buildRouter(controller);
