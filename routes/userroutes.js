const userroutes = require("express").Router();
const userCtrl = require("../controllers/userCtrl.js");
const JWTAUTH = require('../middlewares/auth.js');

try {
  userroutes.post("/createnotification", userCtrl.createnotification);
  userroutes.post("/sendotp", userCtrl.sendOtp);
  userroutes.post("/verifyotp", userCtrl.verifyotp);
  userroutes.post("/registeruser", userCtrl.adduser);
  userroutes.post("/updateuser",JWTAUTH, userCtrl.updateuser);
  userroutes.post("/updateuserbgimage",JWTAUTH, userCtrl.updateUserBGImage);
  userroutes.post("/getuserbyid",JWTAUTH, userCtrl.getUserById);
  userroutes.post("/applyforvendor",JWTAUTH, userCtrl.applyForVendor);
  userroutes.post("/applyforadvertising",JWTAUTH, userCtrl.applyForAdvertising);
  userroutes.post("/mynotification",JWTAUTH, userCtrl.mynotification);
  userroutes.post("/deletenotification",JWTAUTH, userCtrl.deletenotification);
  userroutes.post("/aboutus", userCtrl.aboutus);
  userroutes.post("/privacyandpolicy", userCtrl.privacyandpolicy);
  userroutes.post("/termandcondition", userCtrl.termandcondition);
  userroutes.post("/faq", userCtrl.faq);
  userroutes.post("/homedata", userCtrl.homeData);
  userroutes.post("/bestdeal",JWTAUTH, userCtrl.bestDeal);
  userroutes.post("/enquerylist",JWTAUTH, userCtrl.enqueryList);
  userroutes.post("/ratevendor",JWTAUTH, userCtrl.rateVendor);

  


  



  module.exports = userroutes;
} catch (error) {
  console.log(error);
}