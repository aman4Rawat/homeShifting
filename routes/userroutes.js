const userroutes = require("express").Router();
const userCtrl = require("../controllers/userCtrl.js");
const JWTAUTH = require('../middlewares/auth.js');

try {
  userroutes.post("/sendotp", userCtrl.sendOtp);
  userroutes.post("/verifyotp", userCtrl.verifyotp);
  userroutes.post("/logincreate", userCtrl.adduser);
  userroutes.post("/updateuser",JWTAUTH, userCtrl.updateuser);
  userroutes.post("/getuserbyid",JWTAUTH, userCtrl.getUserById);
  userroutes.post("/applyforvendor",JWTAUTH, userCtrl.applyForVendor);
  userroutes.post("/applyforadvertising",JWTAUTH, userCtrl.applyForAdvertising);



  module.exports = userroutes;
} catch (error) {
  console.log(error);
}