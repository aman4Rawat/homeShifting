const userroutes = require("express").Router();
const userCtrl = require("../controllers/userCtrl.js");

try {
  userroutes.post("/logincreate", userCtrl.adduser);
  userroutes.post("/sendotp", userCtrl.sendOtp);
  userroutes.post("/verifyotp", userCtrl.verifyotp);


  module.exports = userroutes;
} catch (error) {
  console.log(error);
}