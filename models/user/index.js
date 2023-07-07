const userSchema = require("./userSchema.js");
const otpSchema = require("./otpSchema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP = require('../../services/OTP.js')
const  JWTSECRET  = process.env.JWTSECRET;
try {
  module.exports = {
    adduser: async (doc) => {
      try {
        const data = await userSchema.findOne({mobile_number:doc.number});
        if(!data){
        const admin = new userSchema({
          mobile_number: doc.number,
          name: doc.name,
          gender: doc.gender,
          email:doc.email,
        });
        const data = await admin.save();
        return data;
      }else{
        return data;
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
        const user = await otpSchema.findOne({mobile_number:number});
        if(!user){
          const newUser = new otpSchema({
            mobile_number: number,
            otp: otp,
            expire_time:time,
            wrong_attempt:0
          })
          await newUser.save();
        }else{
          await otpSchema.findOneAndUpdate({_id:user._id, mobile_number:number},{otp:otp, expire_time:time, wrong_attempt:0, is_active:true},{new:true});
        }
        const data  = await OTP.sendOTP(number,otp);
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
        const user = await otpSchema.findOne({mobile_number:number});
        if(!user){return new Error("Please register with this number first")};
        if(user.wrong_attempt>=3){return new Error("you have exceed the limit of wrong attemt please resend OTP")};
        if(user.expire_time<time){return new Error("OTP time expired")};
        if(user.otp !== otp){
          const num = user.wrong_attempt+1
          const x = await otpSchema.findOneAndUpdate({mobile_number:number},{wrong_attempt:num},{new:true});
          return new Error(`Wrong OTP, attempt failed ${x.wrong_attempt}`)
        }
        if(user.otp === otp && user.is_active===true){
          await otpSchema.findOneAndUpdate({mobile_number:number},{is_active:false},{new:true});
          const data = await userSchema.findOne({mobile_number:number});
          if(data){
            token = jwt.sign({ user_id: data._id }, JWTSECRET);
            return { token, data };
          }
          return data;
        }{return new Error("OTP has been used")}
      } catch (err) {
        console.log(err);
        return err;
      }
    },


    updateAdmin: async (res, admin_id, updateAdminDoc) => {
      try {
        var admin = await userSchema.findByIdAndUpdate(
          { _id: admin_id },
          {
            $set: {
              name: updateAdminDoc.name,
              mobile_number: updateAdminDoc.mobile_number,
              is_active: updateAdminDoc.is_active,
            },
          }
        );
        return admin;
      } catch (err) {
        return err;
      }
    },

    getByIdAdmin: async (res, admin_id) => {
      try {
        var admin = await userSchema.findOne({
          _id: admin_id,
          is_active: true,
        });
        return admin;
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
