const paymentRoute = require("express").Router();
const paymentCtrl = require("../controllers/paymentCtrl.js");
const jwtauth = require("../middlewares/auth");

try {
    paymentRoute.post("/createpayment",jwtauth, paymentCtrl.createPayment);

  module.exports = paymentRoute;
} catch (error) {
  console.log(error);
}