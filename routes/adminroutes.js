const adminroutes = require("express").Router();
const adminCtrl = require("../controllers/adminCtrl.js");
const jwtauth = require("../middlewares/auth");

try {
  adminroutes.post("/addadmin", adminCtrl.addAdmin);
  adminroutes.post("/loginadmin", adminCtrl.loginAdmin);
  adminroutes.get("/adminbyid",jwtauth, adminCtrl.adminById);
  adminroutes.post("/mainbanner",jwtauth, adminCtrl.mainBanner);
  adminroutes.post("/mainbannerlist",jwtauth, adminCtrl.mainBannerList);
  adminroutes.post("/mainbannerupdate",jwtauth, adminCtrl.mainBannerUpdate);
  adminroutes.post("/threebannerlist",jwtauth, adminCtrl.threeBannerList);
  adminroutes.post("/threebanner",jwtauth, adminCtrl.threeBanners);
  adminroutes.post("/appdataadd",jwtauth, adminCtrl.appDataAdd);
  adminroutes.post("/makevander",jwtauth, adminCtrl.makeVander);
  //add servide as subCategory
  adminroutes.post("/addsubcategorybyvendorid",jwtauth, adminCtrl.addSubcategoryByBusinessId);
  
  adminroutes.post("/craetevenderprofile",jwtauth, adminCtrl.createVendorProfile);
  adminroutes.post("/createpackage",jwtauth, adminCtrl.createPackage);
  
  adminroutes.post("/allusers",jwtauth, adminCtrl.allUsers);
  adminroutes.post("/allvendors",jwtauth, adminCtrl.allVendors);
  adminroutes.post("/findallbusiness",jwtauth, adminCtrl.findAllBusiness);
  adminroutes.post("/namechangerequestlist",jwtauth, adminCtrl.nameChangeRequestList);
  adminroutes.post("/updatenameofbusiness",jwtauth, adminCtrl.nameChangeRequestUpdate);
  
  //locality start
  adminroutes.post("/addlocality",jwtauth, adminCtrl.addlocality);
  adminroutes.post("/getlocality",jwtauth, adminCtrl.getlocality);
  adminroutes.post("/updatelocality",jwtauth, adminCtrl.updatelocality);
  adminroutes.post("/zroorat", adminCtrl.zroorat2);//agr kisi city main state nhi aa raha hai tb postman se chalani hai

  adminroutes.post("/freelistingotpsend", jwtauth, adminCtrl.freeListingOtpSend);
  adminroutes.post("/freelistingotpverify", jwtauth, adminCtrl.freeListingOtpVerify);
  
  module.exports = adminroutes;
} catch (error) {
  console.log(error);
}