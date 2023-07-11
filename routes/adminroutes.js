const adminroutes = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl.js");
const jwtauth = require("../middlewares/auth");

try {
  adminroutes.post("/addadmin", adminCtrl.addAdmin);
  adminroutes.post("/loginadmin", adminCtrl.loginAdmin);
  adminroutes.post("/mainbanner",jwtauth, adminCtrl.mainBanner);
  adminroutes.post("/threebanner",jwtauth, adminCtrl.threeBanners);
  

  module.exports = adminroutes;
} catch (error) {
  console.log(error);
}