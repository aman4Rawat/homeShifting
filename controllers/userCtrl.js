const userModel = require("../models/user/index.js");
const adminValidation = require("../validator/adminValidation.js");
const utils = require("../libs/utils");
const otpGenerator = require('otp-generator');
const upload = require('../middlewares/multer.js')

try {
  module.exports = {
    adduser: async (req, res) => {
      try {
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.file) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const body = {
            email: req.body.email,
            number: req.body.number,
            gender: req.body.gender,
            name: req.body.name,          
          };
          const data = req.file; 
          const result = await userModel.adduser(body,data);
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

    sendOtp: async (req, res) => {
      try {
        const body = {
          number: req.body.number,
        };
        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
        body.otp = otp;
        const result = await userModel.sendOtp(body);
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
          otp: req.body.otp
        };
        const result = await userModel.verifyotp(body);
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
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          
          const userDoc = {
            is_active: req.body.is_active,
            gender: req.body.gender,
            name: req.body.name,
            dob: req.body.dob,
            id: req.body.id,
          };
          if(req.file){
            userDoc.profile_image = req.file.path;
          }
          const result = await userModel.updateAdmin(
            userDoc
          );
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

    removeAdmin: async (req, res) => {
      try {
        const admin_id = req.params._id;
        const updateAdminDoc = {
          is_active: false,
        };
        const result = await userModel.updateAdmin(
          res,
          admin_id,
          updateAdminDoc
        );
        res.send(result);
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },

    getUserById: async (req, res) => {
      try {
        const id = req.body.id;
        const result = await userModel.getByIdUser(id);
        res.send(result);
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },

    contactus: async (req, res) => {
      try {
        const data = {
          name: req.body.name,
          email: req.body.email,
          message: req.body.message,
        };
        const result = await userModel.contactus(data);
        res.send(result);
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
  };
} catch (err) {
  console.log(err);
}
