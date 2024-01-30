const paymentRoute = require("express").Router();
const paymentCtrl = require("../controllers/paymentCtrl.js");
const jwtauth = require("../middlewares/auth");
const apyment = require("../services/payment.js")

try {
    paymentRoute.post("/createpayment",jwtauth, paymentCtrl.createPayment);
    paymentRoute.post("/createorder",jwtauth, paymentCtrl.createOrder);
    paymentRoute.post("/getpaymentstatus",jwtauth, paymentCtrl.getPaymentStatus);
    paymentRoute.post("/suggestionplaneadd",jwtauth, paymentCtrl.suggestionPlaneAdd);
    paymentRoute.post("/suggestionplanelist",jwtauth, paymentCtrl.suggestionPlaneList);
    //package purchase
    paymentRoute.post("/purchasepackage",jwtauth, paymentCtrl.purchasePackage);
    paymentRoute.post("/verifypurchasepackage",jwtauth, paymentCtrl.verifyPurchasePackage);
    
    
    //PhonePe Payment Gateway
    // paymentRoute.post("/payment",jwtauth, apyment.phonePePayment);
    
    
    paymentRoute.post("/invoice",jwtauth, paymentCtrl.invoice);
    paymentRoute.post("/invoicebyid",jwtauth, paymentCtrl.invoiceById);


  module.exports = paymentRoute;
} catch (error) {
  console.log(error);
}