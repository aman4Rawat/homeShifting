const adminroutes = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl.js");
const jwtauth = require("../middlewares/auth");

try {
  adminroutes.post("/addadmin", adminCtrl.addAdmin);
  adminroutes.post("/loginadmin", adminCtrl.loginAdmin);
  adminroutes.post("/mainbanner",jwtauth, adminCtrl.mainBanner);
  adminroutes.post("/threebanner",jwtauth, adminCtrl.threeBanners);
  adminroutes.post("/appdataadd",jwtauth, adminCtrl.appDataAdd);
  adminroutes.post("/makevander",jwtauth, adminCtrl.makeVander);
  adminroutes.post("/craetevenderprofile", adminCtrl.createVendorProfile);


  

  module.exports = adminroutes;
} catch (error) {
  console.log(error);
}