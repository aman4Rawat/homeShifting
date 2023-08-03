const vendorRoutes = require("express").Router();
const vendorCtrl = require("../controllers/vendorCtrl.js");
const JWTAUTH = require('../middlewares/auth.js');
try {
  vendorRoutes.post("/findvendorbycategoryid", vendorCtrl.findVendorbyCategoryId);
  vendorRoutes.post("/findvendorbyid",JWTAUTH, vendorCtrl.findVendorbyId);
  vendorRoutes.post("/vendorprofileimage", vendorCtrl.vendorprofileimage);
  vendorRoutes.post("/vendorbackgroundimage", vendorCtrl.vendorbackgroundimage);
  vendorRoutes.post("/uploaddocuments", vendorCtrl.uploadVendorDocuments);
  vendorRoutes.post("/uploadgallary", vendorCtrl.uploadgallary);

  


  



  module.exports = vendorRoutes;
} catch (error) {
  console.log(error);
}