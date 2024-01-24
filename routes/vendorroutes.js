const vendorRoutes = require("express").Router();
const vendorCtrl = require("../controllers/vendorCtrl.js");
const JWTAUTH = require('../middlewares/auth.js');
try {
  vendorRoutes.post("/findvendorbycategoryid", vendorCtrl.findVendorbyCategoryId);
  vendorRoutes.post("/findvendorbyid", vendorCtrl.findVendorbyId);
  vendorRoutes.post("/findvendorbusinessbytoken",JWTAUTH, vendorCtrl.findVendorBusinessByToken);
  //update vendor profile
  vendorRoutes.post("/vendorprofileimage", vendorCtrl.vendorprofileimage);
  vendorRoutes.post("/vendorbackgroundimage", vendorCtrl.vendorbackgroundimage);
  vendorRoutes.post("/uploaddocuments", vendorCtrl.uploadVendorDocuments);
  vendorRoutes.post("/uploadgallary", vendorCtrl.uploadgallary);
  vendorRoutes.post("/deleteimages", vendorCtrl.deletegallaryimages);
  vendorRoutes.post("/updatebusinessdetails", vendorCtrl.updatebusinessDetails);
  vendorRoutes.post("/updatecontactdetails",JWTAUTH, vendorCtrl.updateContactDetails);
  vendorRoutes.post("/updateadderess", vendorCtrl.updateAdderss);
  vendorRoutes.post("/updateapaymenttype", vendorCtrl.updatePatmentType);
  vendorRoutes.post("/updatevenderdetails",JWTAUTH, vendorCtrl.updateVendorDetails);  
  //add services as subCategory
  vendorRoutes.post("/addsubcategorybyvendorid",JWTAUTH, vendorCtrl.addSubcategoryByBusinessId);
  vendorRoutes.post("/removesubcategorybyvendorid",JWTAUTH, vendorCtrl.removeSubcategoryByBusinessId);
  
  //reviewsssssssssssss
  vendorRoutes.post("/reviewbybusinessid", vendorCtrl.reviewByBusinessId);
  vendorRoutes.post("/reviewthisvendor",JWTAUTH, vendorCtrl.reviewThisVendor);
  vendorRoutes.post("/getmyreviewofthisvendor",JWTAUTH, vendorCtrl.getMyReviewOfThisVendor);
  vendorRoutes.post("/businessreviewlist",JWTAUTH, vendorCtrl.businessReviewList);
  vendorRoutes.post("/responsereviewbyid",JWTAUTH, vendorCtrl.responseReviewById);

  vendorRoutes.post("/suggestion",JWTAUTH, vendorCtrl.suggestion);
  vendorRoutes.post("/uploadsocialmedia",JWTAUTH, vendorCtrl.uploadSocialMedia);
  vendorRoutes.post("/uploadtiming",JWTAUTH, vendorCtrl.uploadTiming);
  // depricated  uploadpaymenttype
  vendorRoutes.post("/nameupdaterequest",JWTAUTH, vendorCtrl.nameUpdateRequest);

  vendorRoutes.post("/uploadpaymenttype",JWTAUTH, vendorCtrl.uploadPaymentType);
  vendorRoutes.post("/clickonsocialmedia",JWTAUTH, vendorCtrl.clickOnSocialMedia);
  vendorRoutes.post("/businessdashboard",JWTAUTH, vendorCtrl.businessDashboard);
  vendorRoutes.post("/dashboardcallleads",JWTAUTH, vendorCtrl.dashboardCallLeads);
  vendorRoutes.post("/dashboardleads",JWTAUTH, vendorCtrl.dashboardLeads);
  vendorRoutes.post("/dashboardleadsbyid",JWTAUTH, vendorCtrl.dashboardLeadById);

  vendorRoutes.post("/packagedetails",JWTAUTH, vendorCtrl.packageDetails);
  vendorRoutes.post("/currentpackage",JWTAUTH, vendorCtrl.currentPackageDetails);
  vendorRoutes.post("/singlepackagedetailsbyid",JWTAUTH, vendorCtrl.singlePackageDetailsById);

  vendorRoutes.post("/support",JWTAUTH, vendorCtrl.support);
  vendorRoutes.post("/askrating",JWTAUTH, vendorCtrl.askForRating);
  vendorRoutes.post("/passbooklisting",JWTAUTH, vendorCtrl.passbookListing);

  //===================== Apis only for State and City ==================

  vendorRoutes.get("/getstate", vendorCtrl.getState);
  vendorRoutes.post("/getcity", vendorCtrl.getCity);
  vendorRoutes.post("/getlocality", vendorCtrl.getLocality);
  vendorRoutes.post("/searchLocation", vendorCtrl.searchLocation);
  
  vendorRoutes.delete("/deleteVendor", vendorCtrl.deleteVendor);
  vendorRoutes.post("/banner", vendorCtrl.createBanner);
  vendorRoutes.get("/listBanner", vendorCtrl.listBanner)
  module.exports = vendorRoutes;
} catch (error) {
  console.log(error);
}