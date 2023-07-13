const adminModel = require("../models/admin/index.js");
const bannerModel = require("../models/admin/index.js");
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
    mainBanner: async (req, res, next) => {
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
    threeBanners: async (req, res, next) => {
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
    addAdmin: async (req, res, next) => {
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
    loginAdmin: async (req, res, next) => {
      try {
        const data = {
          email: req.body.email,
          password: req.body.password,
        };
        const valid = await adminValidation.loginAdmin.validateAsync(data);
        const result = await adminModel.loginAdmin(data);
        if (result instanceof Error) {
          return res.status(403).send(utils.error(result.message));
        } else {
          return res.status(201).send(utils.response(result));
        }
      } catch (err) {
        return err;
      }
    },
  };
} catch (err) {
  console.log(err);
}
