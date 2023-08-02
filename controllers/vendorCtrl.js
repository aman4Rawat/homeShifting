
const userModel = require("../models/user/index.js");
const upload = require("../middlewares/multer.js");
const utils = require("../libs/utils");

try {
  module.exports = {
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
    vendorprofileimage: async (req, res, next) => {
      try {
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.file) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const data = req.file.path;
          const id = req.body.id;
          const result = await userModel.vendorprofileimageUpload(data, id);
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
    vendorbackgroundimage: async (req, res, next) => {
      try {
        upload(req, res, async (err) => {
          if (err) {
            return res.status(500).send(utils.error("Internal server error"));
          }
          if (!req.file) {
            return res.status(400).send(utils.error("No file uploaded"));
          }
          const data = req.file.path;
          const id = req.body.id;
          const result = await userModel.vendorBackgroundimageUpload(data, id);
          return res.status(200).send(utils.response(result));
        });
      } catch (err) {
        return res.status(403).send(utils.error(err));
      }
    },
  };
} catch (err) {
  console.log(err);
}
