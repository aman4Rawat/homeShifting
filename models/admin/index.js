const adminSchema = require("./adminSchema.js");
const bannerSchema = require("./bannerSchema.js");
const banner3Schema = require("./banner3Schema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const JWTSECRET = process.env.JWTSECRET;
const BASEURL = process.env.BASEURL;
try {
  module.exports = {
    addMailBanner: async (data) => {
      try {
        const checkBanner = await bannerSchema.find();
        if (checkBanner.length === 0) {
          const mainBanner = bannerSchema({
            banner_main_image: BASEURL+data.path,
          });
          await mainBanner.save();
          return "Banner Uploaded Successfully";
        } else {
          await bannerSchema.findByIdAndUpdate(
            { _id: checkBanner[0]._id },
            { banner_main_image: BASEURL+data.path },
            { new: true }
          );
          return "Banner Updated Successfully";
        }
      } catch (err) {
        return err;
      }
    },
    threeBanner: async (data) => {
      try {
        const checkBanner = await banner3Schema.find();
        if (checkBanner.length < 3) {
          const banner = new banner3Schema({
            banner_three_image: BASEURL+data.path,
          });
          await banner.save();
          return "Banner uploaded successfully";
        } else {
          return new Error("First delete a image to upload this image because length is full");
        }
      } catch (err) {
        return err;
      }
    },

    addAdmin: async (doc) => {
      try {
        const hashPassword = await bcrypt.hash(doc.password, 12);
        const admin = new adminSchema({
          name: doc.name,
          mobile_number: doc.mobile_number,
          email: doc.email,
          password: hashPassword,
          gender: doc.gender,
        });
        return await admin.save();
      } catch (err) {
        return new Error(err.errmsg);
      }
    },
    loginAdmin: async (doc) => {
      try {
        const email = doc.email;
        const password = doc.password;
        let token;
        if (!email || !password) {
          return new Error("email and password not found");
        } else if (!email) {
          return new Error("email not found");
        } else if (!password) {
          return new Error("password not found");
        } else {
          const admin = await adminSchema.findOne({ email: email });
          if (!admin) {
            return new Error("admin not found");
          } else {
            if (await bcrypt.compare(password, admin.password)) {
              if (admin.is_active === true) {
                token = jwt.sign(
                  { admin_id: admin._id, role: admin.role, email },
                  JWTSECRET
                );
                return { token: token, admin: admin };
              } else {
                return new Error("Account is not Activated");
              }
            } else {
              return new Error("Incorrect Password");
            }
          }
        }
      } catch (err) {
        console.log(err);
        return err;
      }
    },


  };
} catch (e) {
  log.error(e);
}
