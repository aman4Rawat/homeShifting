const paymentRoute = require("express").Router();
const paymentCtrl = require("../controllers/paymentCtrl.js");
const jwtauth = require("../middlewares/auth");

try {
    paymentRoute.post("/createpayment",jwtauth, paymentCtrl.createPayment);
    paymentRoute.post("/createorder",jwtauth, paymentCtrl.createOrder);
    paymentRoute.post("/getpaymentstatus",jwtauth, paymentCtrl.getPaymentStatus);
    paymentRoute.post("/suggestionplaneadd",jwtauth, paymentCtrl.suggestionPlaneAdd);
    paymentRoute.post("/suggestionplanelist",jwtauth, paymentCtrl.suggestionPlaneList);
    paymentRoute.post("/purchasepackage",jwtauth, paymentCtrl.purchasePackage);
    

    
    
    paymentRoute.post("/invoice",jwtauth, paymentCtrl.invoice);

  module.exports = paymentRoute;
} catch (error) {
  console.log(error);
}