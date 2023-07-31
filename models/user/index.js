const userSchema = require("./userSchema.js");
const otpSchema = require("./otpSchema.js");
const vendorBusinessSchema = require("./vendorBusinessSchema.js");
const listBusinessSchema = require("./businessListSchema.js");
const jwt = require("jsonwebtoken");
const OTP = require("../../services/OTP.js");
const referralCode = require('referral-code-generator');
const BASEURL = process.env.BASEURL;
const JWTSECRET = process.env.JWTSECRET;
try {
  module.exports = {
    adduser: async (body) => {
      try {
        const user = await userSchema.findOne({ mobile_number: body.number });
        if (!user) {
          const codeRef = referralCode.alphaNumeric('uppercase',2,2);
          const userNew = {};
          userNew.mobile_number= body.number;
          userNew.name= body.name;
          userNew.gender= body.gender;
          userNew.email= body.email;
          userNew.refCode= codeRef;
          if(body.image){
            userNew.profile_image= BASEURL + body.image;
          }
          const newUser = new userSchema(userNew);
          
          const user = await newUser.save();
          token = jwt.sign({ user_id: user._id, role: user.role }, JWTSECRET);
          return {token, user};
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
        let code = process.env.STATICCODE;
        if (user.otp !== otp && code !=otp) {
          const num = user.wrong_attempt + 1;
          const x = await otpSchema.findOneAndUpdate(
            { mobile_number: number },
            { wrong_attempt: num },
            { new: true }
          );
          return new Error(`Wrong OTP, attempt failed ${x.wrong_attempt}`);
        }
        if (user.otp === otp|| code == otp && user.is_active === true) {
          await otpSchema.findOneAndUpdate(
            { mobile_number: number },
            {$set:{ is_active: false }},
            { new: true }
          );
          const data = await userSchema.findOne({ mobile_number: number });
          if (!data) {
            return data;
          }
          token = jwt.sign({ user_id: data._id, role:data.role }, JWTSECRET);
          return { token, data };
        }
        {
          return new Error("OTP has been used");
        }
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
    askforvendor: async (id,verify) => {
      try {
        const user = await listBusinessSchema.findOne({userId:id,requestType:"Business"});
       if(!user || user.requestType !=="Business"){
          const data = new listBusinessSchema({
            mobileNumber:verify.number,
            fullName:verify.name,
            userId:id,
            businessName:verify.businessName,
            pinCode:verify.pinCode,
            city:verify.city,
            requestType:"Business"
          })
          return await data.save();
        }else{
          return new Error("Already applied please contact to admin")
        }
      } catch (err) {
        return err;
      }
    },
    makeNewVander: async (userId) => {
      try {
        const user = await userSchema.findOne({_id:userId});
       if(!user || user.role !=="USER"){
          return new Error("this Id is Not a User's Id")
        }
        const result = await userSchema.findByIdAndUpdate({_id:userId}, {$set:{role:"VENDOR", serviceId}}, {new:true});
        return result;

      } catch (err) {
        return err;
      }
    },
    askforAdvertising: async (id,verify) => {
      try {
        const user = await listBusinessSchema.findOne({userId:id,requestType:"Advertising"});
       if(!user || user.requestType !=="Advertising"){
          const data = new listBusinessSchema({
            mobileNumber:verify.number,
            fullName:verify.name,
            userId:id,
            businessName:verify.businessName,
            pinCode:verify.pinCode,
            city:verify.city,
            requestType:"Advertising"
          })
          return await data.save();
        }else{
          return new Error("Already applied please contact to admin")
        }
      } catch (err) {
        return err;
      }
    },
    vendorProfile: async (body) => {
      try {
        const condition = {};
        for (const key in body) {
          if (body[key] !== undefined) {
            condition[key] = body[key];
          }
        }
        const results = await vendorBusinessSchema.find(condition);
        if(results.length>0){
          return results
        }else{
          const newBusiness = new vendorBusinessSchema(condition);
          const results = await newBusiness.save();
          return results
        }

      } catch (err) {
        return err;
      }
    },
    vendorprofileimageUpload: async (data, id) => {
      try {
        
        const results = await vendorBusinessSchema.findById({_id:id});
        if(!results){
          return new Error("No vendor found with this Id");
        }
        const image = BASEURL+data;
        await vendorBusinessSchema.findByIdAndUpdate({_id:id},{$set:{profileImage:image}},{new:true})
        return "image Updated sucessfully";
      } catch (err) {
        return err;
      }
    },
    vendorBackgroundimageUpload: async (data, id) => {
      try {
        
        const results = await vendorBusinessSchema.findById({_id:id});
        if(!results){
          return new Error("No vendor found with this Id");
        }
        const image = BASEURL+data;
        await vendorBusinessSchema.findByIdAndUpdate({_id:id},{$set:{bgImage:image}},{new:true})
        return "image Updated sucessfully";
      } catch (err) {
        return err;
      }
    },
    vwndorByCategoryId: async (cId) => {
      try {
        const results = await vendorBusinessSchema.find({categoryId:cId});
        if(!results){
          return "No vendor found with this category ";
        }
        return results;
      } catch (err) {
        return err;
      }
    },
    vendorById: async (id) => {
      try {
        const results = await vendorBusinessSchema.find({_id:id});
        if(!results){
          return "No vendor found with this category ";
        }
        return results;
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
