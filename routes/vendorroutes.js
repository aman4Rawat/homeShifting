const vendorRoutes = require("express").Router();
const vendorCtrl = require("../controllers/vendorCtrl.js");
const JWTAUTH = require('../middlewares/auth.js');
try {
  vendorRoutes.post("/findvendorbycategoryid", vendorCtrl.findVendorbyCategoryId);
  vendorRoutes.post("/findvendorbyid", vendorCtrl.findVendorbyId);
  vendorRoutes.post("/vendorprofileimage", vendorCtrl.vendorprofileimage);
  vendorRoutes.post("/vendorbackgroundimage", vendorCtrl.vendorbackgroundimage);
  vendorRoutes.post("/uploaddocuments", vendorCtrl.uploadVendorDocuments);
  vendorRoutes.post("/uploadgallary", vendorCtrl.uploadgallary);
  vendorRoutes.post("/updatebusinessdetails", vendorCtrl.updatebusinessDetails);
  
  vendorRoutes.post("/reviewthisvendor",JWTAUTH, vendorCtrl.reviewThisVendor);
  vendorRoutes.post("/suggestion",JWTAUTH, vendorCtrl.suggestion);
  vendorRoutes.post("/updatecontactdetails",JWTAUTH, vendorCtrl.updateContactDetails);
  vendorRoutes.post("/uploadsocialmedia",JWTAUTH, vendorCtrl.uploadSocialMedia);
  vendorRoutes.post("/uploadtiming",JWTAUTH, vendorCtrl.uploadTiming);
  vendorRoutes.post("/uploadpaymenttype",JWTAUTH, vendorCtrl.uploadPaymentType);



  



  module.exports = vendorRoutes;
} catch (error) {
  console.log(error);
}