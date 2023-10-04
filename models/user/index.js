const userSchema = require("./userSchema.js");
const otpSchema = require("./otpSchema.js");
const bestDeal = require("./bestDealSchema.js");
const vendorBusinessSchema = require("../vendor/vendorBusinessSchema.js");
const listBusinessSchema = require("./businessListSchema.js");
const jwt = require("jsonwebtoken");
const OTP = require("../../services/OTP.js");
const referralCode = require("referral-code-generator");
const categorySchema = require("../services/categorySchema.js");
const BASEURL = process.env.BASEURL;
const JWTSECRET = process.env.JWTSECRET;
try {
  module.exports = {
    adduser: async (body) => {
      try {
        const user = await userSchema.findOne({ mobile_number: body.number });
        if (!user) {
          const codeRef = referralCode.alphaNumeric("uppercase", 2, 2);
          const userNew = {};
          userNew.mobile_number = body.number;
          userNew.name = body.name;
          userNew.gender = body.gender;
          userNew.email = body.email;
          userNew.refCode = codeRef;
          if (body.image) {
            userNew.profile_image = BASEURL + body.image;
          } else {
            userNew.profile_image = BASEURL + `/image/i/defaultuser.jpg`;
          }
          const newUser = new userSchema(userNew);

          const user = await newUser.save();
          token = jwt.sign({ user_id: user._id, role: user.role }, JWTSECRET);
          return { token, user };
        } else {
          token = jwt.sign({ user_id: user._id, role: user.role }, JWTSECRET);
          return { token, user };
        }
      } catch (err) {
        return err;
      }
    },
    sendOtp: async (doc) => {
      try {
        const number = doc.number;
        const otp = doc.otp;
        const time = new Date(Date.now() + 60000 * 5).getTime();
        const user = await otpSchema.findOne({ mobile_number: number });
        if (!user) {
          let newUser = new otpSchema({
            mobile_number: number,
            otp: otp,
            expire_time: time,
          });
          const abc = await newUser.save();
        } else {
          await otpSchema.findOneAndUpdate(
            { _id: user._id, mobile_number: number },
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
        const data = await OTP.sendOTP(number, otp);
        return data;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    verifyotp: async (doc) => {
      try {
        const number = doc.number;
        const otp = Number(doc.otp);
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
          const newUser = await userSchema.findOne({ mobile_number: number });
          if (!newUser) {
            return "null";
          }
          token = jwt.sign(
            { user_id: newUser._id, role: newUser.role },
            JWTSECRET
          );
          console.log(token,"<<<<<<<<<<<<<<<<<<Token>>>>>>>>>>>>>>>>>>>>>>");
          return { token, newUser };
        } else {
          return new Error("OTP has been used");
        }
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    updateUser: async (userDoc,id) => {
      try {
        const condition = {}
        for (const key in userDoc) {
          if (userDoc[key] !== undefined) {
            condition[key] = userDoc[key];
          }
        }
        const result = await userSchema.findByIdAndUpdate({_id:id},{$set:condition},{new:true});
        return result
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    userBGImageUpdate: async (userDoc,id) => {
      try {
        const condition = {}
        for (const key in userDoc) {
          if (userDoc[key] !== undefined) {
            condition[key] = userDoc[key];
          }
        }
        const result = await userSchema.findByIdAndUpdate({_id:id},{$set:condition},{new:true});
        return result
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    getByIdUser: async (id) => {
      try {
        const user = await userSchema.findOne({
          _id: id,
          is_active: true,
        });
        return user;
      } catch (err) {
        return err;
      }
    },
    askforvendor: async (id, verify) => {
      try {
        const user = await listBusinessSchema.findOne({
          userId: id,
          requestType: "Business",
        });
        if(user.isBusinessComplete ===true){
        if (!user || user.requestType !== "Business") {
          const data = new listBusinessSchema({
            mobileNumber: verify.number,
            fullName: verify.name,
            userId: id,
            businessName: verify.businessName,
            pinCode: verify.pinCode,
            city: verify.city,
            requestType: "Business",
          });
          return await data.save();
        } else {
          return new Error("Already applied please contact to admin");
        }}else {
          return new Error("Already applied please contact to admin");
        }
      } catch (err) {
        return err;
      }
    },
    makeNewVander: async (userId) => {
      try {
        const user = await userSchema.findOne({ _id: userId });
        if (!user || user.role !== "USER") {
          return new Error("this Id is Not a User's Id");
        }
        const result = await userSchema.findByIdAndUpdate(
          { _id: userId },
          { $set: { role: "VENDOR" } },
          { new: true }
        );
        return result;
      } catch (err) {
        return err;
      }
    },
    askforAdvertising: async (id, verify) => {
      try {
        const user = await listBusinessSchema.findOne({
          userId: id,
          requestType: "Advertising",
        });
        if (!user || user.requestType !== "Advertising") {
          const data = new listBusinessSchema({
            mobileNumber: verify.number,
            fullName: verify.name,
            userId: id,
            businessName: verify.businessName,
            pinCode: verify.pinCode,
            city: verify.city,
            requestType: "Advertising",
          });
          return await data.save();
        } else {
          return new Error("Already applied please contact to admin");
        }
      } catch (err) {
        return err;
      }
    },
    bestDeal: async (body) => {
      try {
        const vendor = await vendorBusinessSchema.findById({ _id: body.vid });
        if (!vendor) {
          return new Error("No Vendor found with this ID");
        }
        const service = await categorySchema.findById(
          { _id: vendor.categoryId },
          { serviceId: 1 }
        );
        const newDeal = new bestDeal({
          number: body.number,
          email: body.email,
          name: body.name,
          query: body.query,
          vendor: body.vid,
          userId: body.uid,
          categoryId: vendor.categoryId,
          serviceId: service.serviceId,
          enqueryType: "Best Deal",
        });
        const result = await newDeal.save();
        return result;
      } catch (err) {
        return err;
      }
    },
    myEnquery: async (body) => {
      try {
        if (!body.cid) {
          const result = await bestDeal
            .find({ userId: body.uid })
            .populate("vendor").populate("serviceId","name")
            .sort({ createdAt: -1 });
          return result;
        } else {
          const result = await bestDeal
            .find({
              $and: [
                { userId: body.uid },
                {
                  $or: [{ serviceId: body.cid }, { categoryId: body.cid }],
                },
              ],
            })
            .populate("vendor").populate("serviceId","name")
            .sort({ createdAt: -1 });
          return result;
        }
      } catch (err) {
        return err;
      }
    },
    // myRatetoVendor: async (body) => {
    //   try {
    //    if(body.uid === body.vid){
    //     return new Error("you can not rate your self")
    //    }
    //    const abc  = new rating({
    //     businessId : body.vid,
    //     userId: body.uid,
    //     rate: body.rate,
    //     review: body.review,
    //    })
    //    const result = await abc.save();
    //    return result;
    //   } catch (err) {
    //     return err;
    //   }
    // },

  };
} catch (e) {
  log.error(e);
}
