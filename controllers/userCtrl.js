const userModel = require("../models/user/index.js");
const adminValidation = require("../validator/adminValidation.js");
const utils = require("../libs/utils");
const otpGenerator = require('otp-generator');

try {
  module.exports = {
    adduser: async (req, res) => {
      try {
        const body = {
          email: req.body.email,
          number: req.body.number,
          gender: req.body.gender,
          name: req.body.name,          
        };
        const result = await userModel.adduser(body);
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

    updateAdmin: async (req, res) => {
      try {
        const admin_id = req.params.id;
        const updateAdminDoc = {
          name: req.body.name,
          mobile_number: req.body.mobile_number,
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

    getAdminById: async (req, res) => {
      try {
        const admin_id = req.params.id;
        const result = await userModel.getByIdAdmin(res, admin_id);
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
