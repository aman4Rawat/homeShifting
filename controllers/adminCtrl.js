const adminModel = require("../models/admin/index.js");
const bannerModel = require("../models/admin/index.js");
const appDataModel = require("../models/appData/index.js");
const userModel = require("../models/user/index.js");
const venderBUsinessModel = require("../models/vendor/index.js");
const adminValidation = require("../validator/adminValidation.js");
const upload = require("../middlewares/multer.js");
const utils = require("../libs/utils");
const assert = require("assert");
const mongoose = require("mongoose");
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
    mainBannerUpdate: async (req, res) => {
      try {
        const id = req.body.id;
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
    updateThreeBanner: async (req, res) => {
      try {
        const id = req.body.id;
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
          const result = await bannerModel.updateThreeBanner(data, id);
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    mainBannerList: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see banners"));
        }

        const result = await bannerModel.mainBannerList();
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (furr) {
        return res.status(403).send(utils.error(furr));
      }
    },

    threeBannerList: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see banners"));
        }

        const result = await bannerModel.threeBannerList();
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (furr) {
        return res.status(403).send(utils.error(furr));
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
    deleteBanner: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can upload banners"));
        }
        const { id = "" } = req.body;
        if (!mongoose.isValidObjectId(id) || id == "") {
          return res.status(400).send(utils.error("Provide valid banner id"));
        }
        const result = await bannerModel.deleteBanner(data);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
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
        if (!req.userId) {
          return res.status(500).send(utils.error("Not Authantecated"));
        }
        id = req.userId;

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

        const userId = req.body.userId;
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
    addSubcategoryByBusinessId: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can create Vendor business"));
        }
        const subCategories = req.body.subCategoriesname;
        const businessId = req.body.businessId;
        const result = await venderBUsinessModel.addSubCategoryByBusinessId(
          businessId,
          subCategories
        );
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (error) {
        return error;
      }
    },
    allUsers: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res.status(401).send(utils.error("Only Admin can see users"));
        }
        const body = req.body;
        const result = await adminModel.allUserss(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    allVendors: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see vendors"));
        }
        const body = req.body;
        const result = await adminModel.allVendors(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    findAllBusiness: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see vendors"));
        }
        const body = req.body;
        const result = await adminModel.findAllBusiness(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    nameChangeRequestList: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see vendors"));
        }
        const body = req.body;
        const result = await adminModel.nameChangeRequestList(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    nameChangeRequestUpdate: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can see vendors"));
        }
        const body = {
          what: req.body.submit,
          businessId: req.body.businessId,
          name: req.body.name,
          id: req.body.id,
        };

        const result = await adminModel.nameChangeRequestUpdate(body);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    createVendorProfile: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can create vendor's Business"));
        }
        const body = {
          companyName: req.body.companyName,
          constactPersonName: req.body.constactPersonName,
          mobileNumber: req.body.mobileNumber,
          area: req.body.area,
          pinCode: req.body.pinCode,
          categoryId: req.body.categoryId,
          longitude: req.body.longitude,
          latitude: req.body.latitude,
        };
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
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can create package"));
        }
        const data = {
          packageName: req.body.packageName,
          packageAmount: req.body.packageAmount,
          packageDuration: req.body.packageDuration,
          packageDetails: req.body.packageDetails,
          callCharges: req.body.callCharges,
          bestDealCharges: req.body.bestDealCharges,
          socialMediaCharges: req.body.socialMediaCharges,
          websiteCharges: req.body.websiteCharges,
          directionCharges: req.body.directionCharges,
          inqueryCharges: req.body.inqueryCharges,
          othersCharges: req.body.othersCharges,
          chatCharges: req.body.chatCharges,
        };
        console.log("***************DATA***************", data);
        const body =
          await adminValidation.createPackageValidation.validateAsync(data);
        console.log("***************BODY***************", body);
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
    updatePackage: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can create package"));
        }
        const data = {
          packageName: req.body.packageName,
          packageAmount: req.body.packageAmount,
          packageDuration: req.body.packageDuration,
          packageDetails: req.body.packageDetails,
          callCharges: req.body.callCharges,
          bestDealCharges: req.body.bestDealCharges,
          socialMediaCharges: req.body.socialMediaCharges,
          websiteCharges: req.body.websiteCharges,
          directionCharges: req.body.directionCharges,
          inqueryCharges: req.body.inqueryCharges,
          othersCharges: req.body.othersCharges,
          chatCharges: req.body.chatCharges,
        };
        const id = req.params.id;
        console.log("***************DATA***************", data);
        // const body =
        // await adminValidation.createPackageValidation.validateAsync(data);
        // console.log("***************BODY***************", body);
        const result = await adminModel.updateNewPackage(id, data);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    deletePackage: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can create package"));
        }
        const packageId = req.body.id;
        console.log("***************packageId***************", packageId);
        const result = await adminModel.deletePackage(packageId);
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
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can add locality"));
        }
        const data = {
          cityId: req.body.cityId,
          name: req.body.name,
        };
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
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can get locality"));
        }
        const data = {
          city: req.body.city,
          name: req.body.name,
          page: req.body.page || 1,
          limit: req.body.limit || 10,
        };
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
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can update locality"));
        }
        const data = {
          cityId: req.body.cityId,
          name: req.body.name,
          status: req.body.status,
          id: req.body.id,
        };
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

    freeListingOtpSend: async (req, res) => {
      try {
        const phone = req.body.phone;
        assert(phone, new Error(404, "Number is required"));
        const result = await adminModel.freeLlistingSendOTP(phone);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    freeListingOtpVerify: async (req, res) => {
      try {
        const phone = req.body.phone;
        const otp = req.body.otp;
        assert(phone, new Error("Number is required"));
        console.log("before freeListingVerifyOTP", phone, otp);
        const result = await adminModel.freeLlistingVerifyOTP(phone, otp);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    createFuckOption: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can create options"));
        }
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.file) {
            return res
              .status(400)
              .send(utils.error("No file found, Please upload Image"));
          }
          const name = req.body.name;
          const amount = req.body.amount;
          const description = req.body.description;
          const image = req.file.path;
          const result = await adminModel.createFaltukOptions(
            name,
            amount,
            description,
            image
          );
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(201).send(utils.response(result));
          }
        });
      } catch (error) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    listingFuckOption: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res.status(401).send(utils.error("Only Admin can see list"));
        }
        const page = req.body.page || 1;
        const limit = req.body.limit || 8;
        const result = await adminModel.listingFaltukOptions(page, limit);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (error) {
        return res.status(403).send(utils.error(err.message));
      }
    },
    deleteFuckOption: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res.status(401).send(utils.error("Only Admin can see list"));
        }
        const id = req.body.id;
        if (!id) {
          return new Error("options id required");
        }
        const result = await adminModel.deleteFaltukOptions(id);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (error) {
        return res.status(403).send(utils.error(err.message));
      }
    },

    updateFuckOption: async (req, res) => {
      try {
        if (req.role !== "ADMIN") {
          return res
            .status(401)
            .send(utils.error("Only Admin can update options"));
        }
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          const body = req.body;
          const id = req.body.id;
          const condition = {};
          for (const key in body) {
            if (body[key] !== undefined && body[key] !== "id") {
              condition[key] = body[key];
            }
          }
          if (!id) {
            return new Error("Invalid option id");
          }
          const result = await adminModel.updateFaltukOptions(id, condition);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(200).send(utils.response(result));
          }
        });
      } catch (error) {
        return res.status(403).send(utils.error(err.message));
      }
    },
  };
} catch (err) {
  console.log(err);
}
