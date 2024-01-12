const serviceroutes = require("express").Router();
const serviceCtrl = require("../controllers/servicesCtrl");
const jwtauth = require("../middlewares/auth.js");

try {
  serviceroutes.post("/createservice",jwtauth, serviceCtrl.createservice);
  serviceroutes.post("/updateservice",jwtauth, serviceCtrl.updateservice);
  serviceroutes.post("/getallservice",serviceCtrl.getAllService);
  serviceroutes.post("/deleteservice",jwtauth, serviceCtrl.deleteService);
  serviceroutes.post("/createcategory",jwtauth, serviceCtrl.createcategory);
  serviceroutes.post("/updatecategory",jwtauth, serviceCtrl.updatecategory);
  serviceroutes.post("/deletecategory",jwtauth, serviceCtrl.deletecategory);
  serviceroutes.post("/getallcategories", serviceCtrl.getallcategories);
  serviceroutes.post("/categoriesbyserviceid", serviceCtrl.categoriesbyserviceid);
  serviceroutes.post("/allserviceandcategory", serviceCtrl.allserviceandcategory);
  serviceroutes.post("/search", serviceCtrl.search);
  
  //SubCategory only mood off 
  serviceroutes.post("/createsubcategory",jwtauth, serviceCtrl.createSubCategory);
  serviceroutes.post("/updatesubcategory",jwtauth, serviceCtrl.updateSubCategory);
  serviceroutes.post("/allsubcategories",jwtauth, serviceCtrl.allSubCategories);
  



  

  module.exports = serviceroutes;
} catch (error) {
  console.log(error);
}