const userroutes = require("express").Router();
const userCtrl = require("../controllers/userCtrl.js");

try {
  userroutes.post("/sendotp", userCtrl.sendOtp);
  userroutes.post("/verifyotp", userCtrl.verifyotp);
  userroutes.post("/logincreate", userCtrl.adduser);
  userroutes.post("/updateuser", userCtrl.updateuser);
  userroutes.post("/getuserbyid", userCtrl.getUserById);



  module.exports = userroutes;
} catch (error) {
  console.log(error);
}