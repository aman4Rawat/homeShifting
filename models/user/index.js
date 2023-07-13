const userSchema = require("./userSchema.js");
const otpSchema = require("./otpSchema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP = require("../../services/OTP.js");
const BASEURL = process.env.BASEURL;
const JWTSECRET = process.env.JWTSECRET;
try {
  module.exports = {
    adduser: async (body, data) => {
      try {
        const user = await userSchema.findOne({ mobile_number: body.number });
        if (!user) {
          const admin = new userSchema({
            mobile_number: body.number,
            name: body.name,
            gender: body.gender,
            email: body.email,
            profile_image: BASEURL + data.path,
          });
          const user = await admin.save();
          return user;
        } else {
          token = jwt.sign({ user_id: user._id }, JWTSECRET);
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
       const abc =  await newUser.save();
        } else {
          await otpSchema.findOneAndUpdate(
            { _id: user._id, mobile_number: number },
           {$set: { otp: otp, expire_time: time, wrong_attempt: 0, is_active: true }},
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
        if (user.otp !== otp) {
          const num = user.wrong_attempt + 1;
          const x = await otpSchema.findOneAndUpdate(
            { mobile_number: number },
            { wrong_attempt: num },
            { new: true }
          );
          return new Error(`Wrong OTP, attempt failed ${x.wrong_attempt}`);
        }
        if (user.otp === otp && user.is_active === true) {
          await otpSchema.findOneAndUpdate(
            { mobile_number: number },
            {$set:{ is_active: false }},
            { new: true }
          );
          const data = await userSchema.findOne({ mobile_number: number });
          if (data) {
            token = jwt.sign({ user_id: data._id }, JWTSECRET);
            return { token, data };
          }
          return data;
        }
        {
          return new Error("OTP has been used");
        }
      } catch (err) {
        console.log(err);
        return err;
      }
    },

    updateAdmin: async (userDoc) => {
      try {
        const update = {};
        if(userDoc.email){
          update.email=userDoc.email;
        }
        if(userDoc.gender){
          update.gender=userDoc.gender;
        }
        if(userDoc.name){
          update.name=userDoc.name;
        }
        if(userDoc.is_active){
          update.is_active=userDoc.is_active;
        }
        if(userDoc.dob){
          update.dob=userDoc.dob;
        }
        if(userDoc.profile_image){
          update.profile_image= BASEURL + data.path;
        }
        var user = await userSchema.findByIdAndUpdate(
          { _id: userDoc.id },
          {
            $set: update,
          },
          { new: true }
        );
        return user;
      } catch (err) {
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

    contactus: async (data) => {
      try {
        heading = "New Request";
        transporter.sendMail(
          {
            to: "rajanbhatia100@gmail.com",
            from: "newtest960@gmail.com",
            subject: "New Request",
            html: `  <div> Dear Admin , </div> <br>

                         <div> Message:  ${data.message} </div><br>

                         <div> Email:   ${data.email}</div>  <br>

                       <div>Name:  ${data.name}</div>

            <br>
            `,
          },
          (err, res) => {
            if (err) {
              console.log("err", err);
            }

            console.log("res", res);
          }
        );
      } catch (error) {
        return error;
      }
    },
  };
} catch (e) {
  log.error(e);
}
