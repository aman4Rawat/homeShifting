const userModel = require("../models/user/index.js");
const listBusinessModel = require("../models/user/index.js");
const userValidation = require("../validator/userValidation.js");
const notification = require("../models/notification/index.js");
const appData = require("../models/appData/index.js");
const utils = require("../libs/utils");
const otpGenerator = require('otp-generator');
const upload = require('../middlewares/multer.js');
const BASEURL = process.env.BASEURL;

try {
  module.exports = {
    adduser: async (req, res) => {
      try {
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          const body = {
            email: req.body.email,
            number: req.body.number,
            gender: req.body.gender,
            name: req.body.name,          
          };
        if(req.file !== undefined){
          body.image = req.file.path; 
        }
          const result = await userModel.adduser(body);
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
    createnotification: async (req, res) => {
      try {
          const body = {
            title: req.body.title,
            description: req.body.description,
            userId: req.body.userId,        
          };
          const result = await notification.addNotification(body);
          if (result instanceof Error) {
            return res.status(403).send(utils.error(result.message));
          } else {
            return res.status(201).send(utils.response(result));
          }    
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    sendOtp: async (req, res) => {
      try {
        const body = {
          number: req.body.number,
        };
        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
        body.otp = otp;
        const verify = await userValidation.sendOTP.validateAsync(body)
        const result = await userModel.sendOtp(verify);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        console.log(err);
        return res.status(403).send(utils.error(err));
      }
    },
    verifyotp: async (req, res) => {
      try {
        const body = {
          number: req.body.number,
          otp: req.body.otp,
        };
        const verify = await userValidation.verifyOTP.validateAsync(body)
        const result = await userModel.verifyotp(verify);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        console.log(err);
        return res.status(403).send(utils.error(err));
      }
    },
    updateuser: async (req, res) => {
      try {
        if (req.role !== 'USER' && req.role !== 'VENDOR') {
          return res
            .status(401)
            .send(utils.error("Only User can Apply!"));
        }
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          
          const id=req.userId;
          const userDoc = {
            is_active: req.body.is_active,
            gender: req.body.gender,
            email: req.body.email,
            name: req.body.name,
            dob: req.body.dob,
          };
          if(req.file){
            userDoc.profile_image = BASEURL+req.file.path;
          }
          const result = await userModel.updateUser(userDoc,id);
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
    updateUserBGImage: async (req, res) => {
      try {
        if (req.role !== 'USER' && req.role !== 'VENDOR') {
          return res
            .status(401)
            .send(utils.error("Only User can Apply!"));
        }
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          
          const id=req.userId;
          const userDoc = { };
          if(req.file){
            userDoc.background_image = BASEURL+req.file.path;
          }
          const result = await userModel.userBGImageUpdate(userDoc,id);
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
    getUserById: async (req, res) => {
      try {
        if (req.role !== "USER" && req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only User can Apply!"));
        }
        const id = req.body.id;
        const result = await userModel.getByIdUser(id);
        res.send(result);
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    applyForVendor: async (req, res) => {
      try {
        if (req.role !== "USER" && req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only User or Vendor can Apply!"));
        }
        const id = req.userId;
        const body = req.body;
        const verify = await userValidation.applyforVendor.validateAsync(body);
        const result = await listBusinessModel.askforvendor(id,verify);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    applyForAdvertising: async (req, res) => {
      try {
        if (req.role !== "USER" && req.role !=="VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only User or Vendor can Apply!"));
        }
        const id = req.userId;
        const body = req.body;
        const verify = await userValidation.applyforVendor.validateAsync(body);
        const result = await listBusinessModel.askforAdvertising(id,verify);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    mynotification: async (req, res) => {
      try {
        if (req.role !== "USER" && req.role !=="VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only User or Vendor can see notification!"));
        }
        const id = req.userId;
        const result = await notification.usersNotification(id);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    deletenotification: async (req, res) => {
      try {
        if (req.role !== "USER" && req.role !=="VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only User or Vendor can see notification!"));
        }
        const uid = req.userId;
        const id = req.body.id;
        const result = await notification.deleteNotification(id,uid);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(200).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    aboutus: async (req, res) => {
      try {
        const result = await appData.aboutUs();
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    privacyandpolicy: async (req, res) => {
      try {
        const result = await appData.privacyAndPolicy();
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    termandcondition: async (req, res) => {
      try {
        const result = await appData.termAndCondition();
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    faq: async (req, res) => {
      try {
        const result = await appData.fAQ();
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    homeData: async (req, res) => {
      try {
        const result = await appData.homeDataApi();
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    findVendorbyCategoryId: async (req, res) => {
      try {
        const cId = req.body.id;
        const result = await userModel.vwndorByCategoryId(cId);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    findVendorbyId: async (req, res) => {
      try {
        const id = req.body.id;
        const result = await userModel.vendorById(id);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    bestDeal: async (req, res) => {
      try {
        if (req.role !== "USER" && req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only User can Apply!"));
        }
        const body = {
          vid: req.body.vendorId,
          name: req.body.name,
          number: req.body.number,
          email: req.body.email,
          query: req.body.query,
          uid: req.userId,
        };
        
        const result = await userModel.bestDeal(body);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    enqueryList: async (req, res) => {
      try {
        if (req.role !== "USER") {
          return res
            .status(401)
            .send(utils.error("Only User can see!"));
        }
        const body = {
          cid: req.body.id,
          uid: req.userId,
        };
        
        const result = await userModel.myEnquery(body);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    rateVendor: async (req, res) => {
      try {
        if (req.role !== "USER" && req.role !== "VENDOR") {
          return res
            .status(401)
            .send(utils.error("Only User can see!"));
        }
        const body = {
          vid: req.body.businessId,
          uid: req.userId,
          rate: req.body.rate,
          review: req.body.review,
        };
        
        const result = await userModel.myRatetoVendor(body);
        return res.status(200).send(utils.response(result));
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    

  };
} catch (err) {
  console.log(err);
}


