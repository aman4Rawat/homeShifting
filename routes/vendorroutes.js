const vendorRoutes = require("express").Router();
const vendorCtrl = require("../controllers/vendorCtrl.js");
const JWTAUTH = require('../middlewares/auth.js');
try {
  vendorRoutes.post("/findvendorbycategoryid", vendorCtrl.findVendorbyCategoryId);
  vendorRoutes.post("/findvendorbyid", vendorCtrl.findVendorbyId);
  vendorRoutes.post("/vendorprofileimage", vendorCtrl.vendorprofileimage);
  vendorRoutes.post("/vendorbackgroundimage", vendorCtrl.vendorbackgroundimage);
  vendorRoutes.post("/uploaddocuments",JWTAUTH, vendorCtrl.uploadVendorDocuments);
  vendorRoutes.post("/uploadgallary", vendorCtrl.uploadgallary);
  vendorRoutes.post("/uploadsocialmedia", vendorCtrl.uploadSocialMedia);
  
  
  
  vendorRoutes.post("/reviewthisvendor",JWTAUTH, vendorCtrl.reviewThisVendor);


  



  module.exports = vendorRoutes;
} catch (error) {
  console.log(error);
}