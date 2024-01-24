const adminSchema = require("./adminSchema.js");
const vendorBusinessSchema = require("../vendor/vendorBusinessSchema.js");
const bannerSchema = require("./bannerSchema.js");
const banner3Schema = require("./banner3Schema.js");
const packageSchema = require("./packageSchame.js");
const userSchema = require("../user/userSchema.js");
const optionsSchema = require("./optionsSchema.js");
const mongoose = require('mongoose');
const { Locality, City, State } = require("../vendor/stateAndCitySchrma.js");
const { nameUpdateRequest } = require("../vendor/needfullSchema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = require("mongoose");
const otpGenerator = require("otp-generator");
const JWTSECRET = process.env.JWTSECRET;
const otpSchema = require("../../models/user/otpSchema.js");
const BASEURL = process.env.BASEURL;
const { sendOTP, verifyOTP } = require("../../services/OTP.js");
try {
  module.exports = {
    addMailBanner: async (data) => {
      try {
        const checkBanner = await bannerSchema.find();
        if (checkBanner.length < 3) {
          const mainBanner = new bannerSchema({
            banner_main_image: BASEURL + data.path,
          });
          await mainBanner.save();
          return "Banner Uploaded Successfully";
        }
        // else {
        //   await bannerSchema.findByIdAndUpdate(
        //     { _id: checkBanner[0]._id },
        //     { banner_main_image: BASEURL+data.path },
        //     { new: true }
        //   );
        //   return "Banner Updated Successfully";
        // }
      } catch (err) {
        return err;
      }
    },
    mainBannerList: async () => {
      try {
        const data = await bannerSchema.find();
        return data;
      } catch (furr) {
        return furr;
      }
    },
    threeBannerList: async () => {
      try {
        const data = await banner3Schema.find();
        return data;
      } catch (furr) {
        return furr;
      }
    },
    threeBanner: async (data) => {
      try {
        const checkBanner = await banner3Schema.find();
        if (checkBanner.length < 3) {
          const banner = new banner3Schema({
            banner_three_image: BASEURL + data.path,
          });
          await banner.save();
          return "Banner uploaded successfully";
        } else {
          return new Error(
            "First delete a image to upload this image because length is full"
          );
        }
      } catch (err) {
        return err;
      }
    },
    deleteBanner: async (id) => {
      try {
        const deleteBanner = await banner3Schema.findByIdAndDelete(id);
        if (!deleteBanner) {
          return "Banner delete successfully";
        } else {
          return new Error("Banner not deleted try again!");
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
    adminById: async (id) => {
      try {
        const result = await adminSchema.findById({ _id: id });
        if (!result) {
          return new Error("No data found");
        }
        return result;
      } catch (err) {
        return err;
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
    createNewPackage: async (body) => {
      try {
        let condition = {};
        for (let key in body) {
          if (body[key] !== undefined) {
            condition[key] = body[key];
          }
        }

        const package = new packageSchema(condition);
        const result = await package.save();
        return result;
      } catch (err) {
        return err;
      }
    },
    updateNewPackage: async (id, body) => {
      try {
        if(!mongoose.isValidObjectId(id)){
          return new Error("Please provide valid id");
        }
        let condition = {};
        for (let key in body) {
          if (body[key] !== undefined) {
            condition[key] = body[key];
          }
        }

        const result = await packageSchema.findByIdAndUpdate(id, condition, { new: true });
        return result;
      } catch (err) {
        return err;
      }
    },
    deletePackage: async (id) => {
      try {
        console.log("**********deletePackage**********", id);
        const package = await packageSchema.findByIdAndUpdate(id, {
          status: false,
        });
        console.log("**********package**********", package);
        if (!package) {
          return new Error("Please try again!");
        }
        return "Package deleted successfully!";
      } catch (err) {
        return err;
      }
    },
    allUserss: async (body) => {
      try {
        const limit = body.limit || 10;
        const page = body.page || 1;

        const condition = {};
        condition.role = "USER";
        if (body.search) {
          condition.name = { $regex: new RegExp(body.search, "i") };
        }

        const sex = await userSchema.find(condition).countDocuments();
        totalPages = Math.ceil(sex / limit);
        const result = await userSchema
          .find(condition)
          .skip((page - 1) * limit)
          .limit(limit);
        return { result, totalPages };
      } catch (error) {
        return error;
      }
    },
    allVendors: async (body) => {
      try {
        const limit = body.limit || 10;
        const page = body.page || 1;

        const condition = {};
        condition.role = "VENDOR";
        if (body.search) {
          condition.name = { $regex: new RegExp(body.search, "i") };
        }

        const sex = await userSchema.find(condition).countDocuments();
        totalPages = Math.ceil(sex / limit);
        const result = await userSchema
          .find(condition)
          .skip((page - 1) * limit)
          .limit(limit);
        return { result, totalPages };
      } catch (error) {
        return error;
      }
    },
    findAllBusiness: async (body) => {
      try {
        const limit = body.limit || 10;
        const page = body.page || 1;

        const sex = await vendorBusinessSchema.find().countDocuments();
        totalPages = Math.ceil(sex / limit);
        const result = await vendorBusinessSchema
          .find()
          .skip((page - 1) * limit)
          .limit(limit);
        return { result, totalPages };
      } catch (error) {
        return error;
      }
    },
    nameChangeRequestList: async (body) => {
      try {
        const limit = body.limit || 10;
        const page = body.page || 1;

        const count = await nameUpdateRequest.find().countDocuments();
        totalPages = Math.ceil(count / limit);
        const result = await nameUpdateRequest
          .find()
          .populate("businessId", { companyName: 1 })
          .skip((page - 1) * limit)
          .limit(limit);
        return { result, totalPages };
      } catch (error) {
        return error;
      }
    },
    nameChangeRequestUpdate: async (body) => {
      try {
        if (body.what) {
          const result = await vendorBusinessSchema.findByIdAndUpdate(
            { _id: body.businessId },
            { companyName: body.name },
            { new: true }
          );
          await nameUpdateRequest.findByIdAndDelete({ _id: body.id });
          return result;
        } else {
          await nameUpdateRequest.findByIdAndDelete({ _id: body.id });
          return "Rejected Successfully";
        }
      } catch (error) {
        return error;
      }
    },
    addlocality: async (data) => {
      try {
        if (!data.cityId || !data.name) {
          return new Error("Please Enter both City and Name");
        }
        const city = await City.findById({ _id: data.cityId }).populate(
          "state"
        );
        const condition = {};
        condition.city = data.cityId;
        condition.name = { $regex: new RegExp(data.name, "i") };
        const oldData = await Locality.find(condition);
        if (oldData.length > 0) {
          return oldData;
        } else {
          const poplu = new Locality({
            city: data.cityId,
            cityName: city.name,
            stateName: city?.state?.name,
            name: data.name,
          });
          const sexa = await poplu.save();
          return sexa;
        }
      } catch (err) {
        return err;
      }
    },
    getlocality: async (data) => {
      try {
        const condition = {
          name: { $regex: new RegExp(data.name, "i") },
        };
        if (data.city) {
          condition.cityName = { $regex: new RegExp(data.city, "i") };
        }

        const result = await Locality.find(condition)
          .skip((data.page - 1) * data.limit)
          .limit(data.limit);
      } catch (err) {
        return err;
      }
    },
    updatelocality: async (data) => {
      try {
        if (data.cityId) {
          condition.city = data.cityId;
          const poplu = await City.findById({ _id: data.cityId });
          condition.cityName = poplu?.name;
        }

        if (data.name) {
          condition.name = data.name;
        }
        if (data.status) {
          condition.isActive = data.ststus;
        }

        const result = await Locality.findByIdAndUpdate(
          { _id: data.id },
          { $set: condition },
          { new: true }
        );
        return result;
      } catch (err) {
        return err;
      }
    },
    zroorat: async () => {
      try {
        const arr = await City.find().populate("state");
        const newabro = arr.map(async (x) => {
          if (!x.stateName) {
            console.log("yaha ayiiiiiiiiiiiiiiiiiiiiiiiiiii");
            await City.findByIdAndUpdate(
              { _id: x.id },
              { stateName: x.state.name },
              { new: true }
            );
          } else {
            console.log("doneeeeeeeeeeeeeeeeeeeee");
          }
        });

        return "sucess";
      } catch (err) {
        return err;
      }
    },
    freeLlistingSendOTP: async (phone) => {
      try {
        const otp = otpGenerator.generate(4, {
          upperCaseAlphabets: false,
          specialChars: false,
          lowerCaseAlphabets: false,
        });
        const time = new Date(Date.now() + 60000 * 5).getTime();
        const user = await otpSchema.findOne({ mobile_number: phone });
        if (!user) {
          let newUser = new otpSchema({
            mobile_number: phone,
            otp: otp,
            expire_time: time,
          });
          const abc = await newUser.save();
        } else {
          await otpSchema.findOneAndUpdate(
            { _id: user._id, mobile_number: phone },
            {
              $set: {
                otp: otp,
                expire_time: time,
                wrong_attempt: 0,
                is_active: true,
              },
            },
            { new: true }
          );
        }
        const result = await sendOTP(phone, otp);

        return result;
      } catch (err) {
        return err;
      }
    },
    freeLlistingVerifyOTP: async (phone, otps) => {
      try {
        const number = phone;
        const otp = Number(otps);
        const time = new Date(Date.now()).getTime();
        const user = await otpSchema.findOne({ mobile_number: number });
        if (!user) {
          return new Error("Please register with this number first");
        }
        if (user.wrong_attempt >= 3) {
          return new Error(
            "you have exceed the limit of wrong attemt please resend OTP"
          );
        }
        if (user.expire_time < time) {
          return new Error("OTP time expired");
        }
        let code = process.env.STATICCODE;
        if (user.otp !== otp && code != otp) {
          const num = user.wrong_attempt + 1;
          const x = await otpSchema.findOneAndUpdate(
            { mobile_number: number },
            { wrong_attempt: num },
            { new: true }
          );
          return new Error(`Wrong OTP, attempt failed ${x.wrong_attempt}`);
        }
        if (user.otp === otp || (code == otp && user.is_active === true)) {
          await otpSchema.findOneAndUpdate(
            { mobile_number: number },
            { $set: { is_active: false } },
            { new: true }
          );
          console.log("after freeListingVerifyOTP", number, otp);
          const vendor = await vendorBusinessSchema.findOneAndUpdate(
            { mobileNumber: number },
            { is_active: true, isFree: true },
            { new: true }
          );
          console.log("updatedVendor********", vendor);
          return "Congratulations";
        } else {
          return new Error("OTP has been used");
        }
      } catch (error) {
        return error;
      }
    },
    createFaltukOptions: async (name, amount, description, image) => {
      try {
        let update = {
          name: name,
          amount: amount,
          description: description,
        };
        if (image) {
          update.image = BASEURL + image;
        }
        const abc = new optionsSchema(update);
        const result = await abc.save();
        return result;
      } catch (error) {
        return error;
      }
    },

    listingFaltukOptions: async (page, limit) => {
      try {
        const result = await optionsSchema
          .find()
          .skip((page - 1) * limit)
          .limit(page);
        return result;
      } catch (error) {
        return error;
      }
    },
    deleteFaltukOptions: async (id) => {
      try {
        const result = await optionsSchema.findByIdAndDelete({ _id: id });
        return result;
      } catch (error) {
        return error;
      }
    },
    updateFaltukOptions: async (id, condition) => {
      try {
        if (condition.image) {
          condition.image = BASEURL + image;
        }
        const result = await optionsSchema.findByIdAndUpdate(
          { _id: id },
          condition,
          { new: true }
        );
        return result;
      } catch (error) {
        return error;
      }
    },
  };
} catch (e) {
  log.error(e);
}
