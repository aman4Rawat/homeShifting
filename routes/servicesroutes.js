const adminroutes = require("express").Router();
const serviceCtrl = require("../controllers/servicesCtrl");
const jwtauth = require("../middlewares/auth.js");

try {
  adminroutes.post("/createservice",jwtauth, serviceCtrl.createservice);
  adminroutes.post("/getallservice",jwtauth, serviceCtrl.getAllService);
  adminroutes.post("/createcategory",jwtauth, serviceCtrl.createcategory);
  adminroutes.post("/getallcategories",jwtauth, serviceCtrl.getallcategories);



  

  module.exports = adminroutes;
} catch (error) {
  console.log(error);
}