const adminModel = require("../models/admin/index.js");
const bannerModel = require("../models/admin/index.js");
const appDataModel = require("../models/appData/index.js");
const userModel = require("../models/user/index.js");
const venderBUsinessModel = require("../models/vendor/index.js");
const adminValidation = require("../validator/adminValidation.js");
const upload = require("../middlewares/multer.js");
const utils = require("../libs/utils");
// const multer = require("multer");
// const fs = require("fs");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (!fs.existsSync("image")) {
//       fs.mkdirSync("image", { recursive: true });
//     }
//     cb(null, "image");
//   },
//   filename: function (req, file, cb) {
//     const { originalname } = file;
//     let fileExt = ".jpeg";
//     const extI = originalname.lastIndexOf(".");
//     if (extI !== -1) {
//       fileExt = originalname.substring(extI).toLowerCase();
//     }
//     const fileName = `${Date.now()}-image${fileExt}`;
//     cb(null, fileName);
//   },
// });

// const upload = multer({
//   storage: storage,
// }).single("Image");

try {
  module.exports = {
    mainBanner: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can upload main banner"));
        }
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.file) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const data = req.file;
          const result = await bannerModel.addMailBanner(data);
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    threeBanners: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can upload banners"));
        }
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.file) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const data = req.file;
          const result = await bannerModel.threeBanner(data);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(201).send(utils.response(result));
          }
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    addAdmin: async (req, res) => {
      try {
        const data = {
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          mobile_number: req.body.number,
          gender: req.body.gender,
        };
        const valid = await adminValidation.addAdmin.validateAsync(data);
        const result = await adminModel.addAdmin(valid);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    loginAdmin: async (req, res) => {
      try {
        const data = {
          email: req.body.email,
          password: req.body.password,
        };
        const valid = await adminValidation.loginAdmin.validateAsync(data);
        const result = await adminModel.loginAdmin(valid);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    adminById: async (req, res) => {
      try {
          if(!req.userId){
            return res.status(500).send(utils.error("Not Authantecated"));
          }
          id= req.userId;
        
        const result = await adminModel.adminById(id);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    appDataAdd: async (req, res) => {
      try {
        const data = {
          aboutUs: req.body.aboutUs,
          privacyAndPolicy: req.body.privacyAndPolicy,
          termAndCondition: req.body.termAndCondition,
          fAQ: req.body.fAQ,
        };
        const result = await appDataModel.addAppData(data);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    makeVander: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can create Vendor business"));
        }
        
        const  userId=req.body.userId
        const result = await userModel.makeNewVander(userId);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },

    addSubcategoryByBusinessId:async(req,res)=>{
      try{
         if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can create Vendor business"));
        }
        const subCategories = req.body.subCategories
        const  businessId=req.body.businessId;
        const result = await venderBUsinessModel.addSubCategoryByBusinessId(businessId,subCategories);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }

      }catch(sex){
        return sex;
      }
    },



    allUsers:async(req,res)=>{
      try{
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see users"));
        }
        const body= req.body;
        const result = await adminModel.allUserss(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }

      }catch(err){ return res.status(403).send(utils.error(err));}
    },
    allVendors:async(req,res)=>{
      try{
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see vendors"));
        }
        const body= req.body;
        const result = await adminModel.allVendors(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }

      }catch(err){ return res.status(403).send(utils.error(err));}
    },
    findAllBusiness:async(req,res)=>{
      try{
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see vendors"));
        }
        const body= req.body;
        const result = await adminModel.findAllBusiness(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }

      }catch(err){ return res.status(403).send(utils.error(err));}
    },
    nameChangeRequestList:async(req,res)=>{
      try{
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see vendors"));
        }
        const body= req.body;
        const result = await adminModel.nameChangeRequestList(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }

      }catch(err){ return res.status(403).send(utils.error(err));}
    },
    nameChangeRequestUpdate:async(req,res)=>{
      try{
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see vendors"));
        }
        const body={
          what:req.body.submit,
          businessId:req.body.businessId,
          name:req.body.name,
          id:req.body.id
        }

        const result = await adminModel.nameChangeRequestUpdate(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }

      }catch(err){ return res.status(403).send(utils.error(err));}
    },
    createVendorProfile: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can create vendor's Business"));
        }
        const body={
          companyName: req.body.companyName,
          constactPersonName: req.body.constactPersonName,
          mobileNumber: req.body.mobileNumber,
          area: req.body.area,
          pinCode: req.body.pinCode,
          categoryId: req.body.categoryId,
          longitude:req.body.longitude,
          latitude:req.body.latitude,
        }
        const result = await venderBUsinessModel.vendorProfile(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    createPackage: async (req, res) => {
      try {
        if (req.role !== "ADMIN") { return res.status(401).send(utils.error("Only Admin can create package")); }
        const data={
          packageName: req.body.packageName,
          packageAmount: req.body.packageAmount,
          packageDuration: req.body.packageDuration,
          packageDetalis: req.body.packageDetails,
          callCharges: req.body.callCharges,
          bestDealCharges: req.body.bestDealCharges,
          socialMediaCharges: req.body.socialMediaCharges,
          websiteCharges: req.body.websiteCharges,
          directionCharges: req.body.directionCharges,
          inqueryCharges: req.body.inqueryCharges,
          othersCharges: req.body.othersCharges,
          chatCharges: req.body.chatCharges,
        }
        const body = await adminValidation.createPackageValidation.validateAsync(data);
        const result = await adminModel.createNewPackage(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    addlocality: async (req, res) => {
      try {
        if (req.role !== "ADMIN") { return res.status(401).send(utils.error("Only Admin can add locality")); }
        const data={
          cityId: req.body.cityId,
          name: req.body.name,
        }
        const result = await adminModel.addlocality(data);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    getlocality: async (req, res) => {
      try {
        if (req.role !== "ADMIN") { return res.status(401).send(utils.error("Only Admin can get locality")); }
        const data={
          city: req.body.city,
          name: req.body.name,
          page: req.body.page || 1,
          limit: req.body.limit || 10,
        }
        const result = await adminModel.getlocality(data);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    updatelocality: async (req, res) => {
      try {
        if (req.role !== "ADMIN") { return res.status(401).send(utils.error("Only Admin can update locality")); }
        const data={
          cityId: req.body.cityId,
          name: req.body.name,
          status: req.body.status,
          id:req.body.id,
        }
        const result = await adminModel.updatelocality(data);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    zroorat2: async (req, res) => {
      try {
        
        const result = await adminModel.zroorat();
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },




  };
} catch (err) {
  console.log(err);
}
