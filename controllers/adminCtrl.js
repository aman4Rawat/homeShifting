const adminModel = require("../models/admin/index.js");
const adminValidation = require("../validator/adminValidation.js");
const utils = require("../libs/utils");

try {
  module.exports = {
    addAdmin: async (req, res) => {
      try {
        const admin = {
          name: req.body.name,
          mobile_number: req.body.mobile_number,
          email: req.body.email,
          password: req.body.password,
        };
        // const adminData = await adminValidation.addAdmin.validateAsync(admin);
        const result = await adminModel.addAdmin(admin);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },

    loginAdmin: async (req, res) => {
      try {
        const admin = {
          email: req.body.email,
          password: req.body.password,
        };

        // const adminData = await adminValidation.loginAdmin.validateAsync(admin);
        const result = await adminModel.loginAdmin(admin);
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
        const result = await adminModel.updateAdmin(
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
        const result = await adminModel.updateAdmin(
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
        const result = await adminModel.getByIdAdmin(res, admin_id);
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
        const result = await adminModel.contactus(data);
        res.send(result);
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
  };
} catch (err) {
  console.log(err);
}
