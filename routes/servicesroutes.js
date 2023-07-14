const adminroutes = require("express").Router();
const serviceCtrl = require("../controllers/servicesCtrl");
const jwtauth = require("../middlewares/auth.js");

try {
  adminroutes.post("/createservice",jwtauth, serviceCtrl.createservice);
  adminroutes.post("/updateservice",jwtauth, serviceCtrl.updateservice);
  adminroutes.post("/getallservice",serviceCtrl.getAllService);
  adminroutes.post("/deleteservice",jwtauth, serviceCtrl.deleteService);
  adminroutes.post("/createcategory",jwtauth, serviceCtrl.createcategory);
  adminroutes.post("/updatecategory",jwtauth, serviceCtrl.updatecategory);
  adminroutes.post("/getallcategories", serviceCtrl.getallcategories);
  adminroutes.post("/categoriesbyserviceid", serviceCtrl.categoriesbyserviceid);
  adminroutes.post("/deletecategory",jwtauth, serviceCtrl.deletecategory);



  

  module.exports = adminroutes;
} catch (error) {
  console.log(error);
}