const mongoose = require("mongoose");
const Users = require("../models/Users.js");
const otpSchema = require("../models/otpSchema.js");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const { sendOTP } = require("../middlewares/sendOTP.js");
const TransactionSchema = require("../models/transactions.js");
module.exports = {
  //depricated createUser and Login

  // createUser: async (req, res) => {
  //   const user = req.body;

  //   try {
  //     const isExist = await Users.findOne({ phone: user.phone });
  //     if (isExist) {
  //       return res.status(403).json({ status: false, message: "Mobile number already registered" });
  //     }
  //     if (!isExist) {
  //       const userResponse = await admin.auth().createUser({
  //         phone: user.phone,
  //         emailVerified: false,
  //         disabled: false,
  //       });

  //       console.log(userResponse.phone);
  //       const newUser = new Users({
  //         username: user.username,
  //         email: user.email,
  //         phone: user.phone,
  //         uid: userResponse.uid,
  //         userType: "Client",
  //         deviceId: user?.deviceId,
  //         deviceToken: user?.deviceToken,
  //       });
  //       const result = await newUser.save();
  //       const token = jwt.sign({ userId: result._id, role: result.userType }, process.env.JWTSECRET, {
  //         expiresIn: "24h",
  //       });
  //       return res.status(201).json({ status: true, message: "successfully register", result, token });
  //     }
  //   } catch (error) {
  //     return res.status(403).json({ status: false, message: error.message });
  //   }
  // },
  // loginUser: async (req, res) => {
  //   try {
  //     const body = {
  //       phone: req.body.phone,
  //       otp: req.body.otp,
  //     };
  //   } catch (error) {
  //     return res.status(403).json({ status: false, message: error.message });
  //   }
  // },

  sendOtp: async (req, res) => {
    try {
      const phone = req.body.phone;
      const otp = Math.floor(1000 + Math.random() * 9000);
      const time = new Date(Date.now() + 60000 * 10).getTime();
      const user = await otpSchema.findOne({ phone: phone });
      if (!user) {
        let newUser = new otpSchema({
          phone: phone,
          otp: otp,
          expireTime: time,
        });
        const abc = await newUser.save();
        await sendOTP(phone, otp);
      } else {
        await otpSchema.findOneAndUpdate(
          { _id: user._id, phone: phone },
          {
            $set: {
              otp: otp,
              expireTime: time,
              wrongAttempt: 0,
              isActive: true,
            },
          },
          { new: true }
        );
        await sendOTP(phone, otp);
      }

      return res.status(200).json({ status: true, message: "OTP send Sucessfully" });
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  verifyotp: async (req, res) => {
    try {
      const doc = req.body;
      const number = doc.phone;
      const otp = Number(doc.otp);
      const time = new Date(Date.now()).getTime();
      const user = await otpSchema.findOne({ phone: number });
      if (!user) {
        return res.status(403).json({ status: false, message: "Please register with this number first" });
      }
      if (user.wrongAttempt >= 3) {
        return res.status(403).json({ status: false, message: "you have exceed the limit of wrong attemt please resend OTP" });
      }
      if (user.expireTime < time) {
        return res.status(403).json({ status: false, message: "OTP time expired" });
      }
      let code = process.env.STATICCODE;
      if (user.otp !== otp && code != otp) {
        const num = user.wrongAttempt + 1;
        const x = await otpSchema.findOneAndUpdate({ phone: number }, { wrongAttempt: num }, { new: true });
        return res.status(403).json({ status: false, message: `Wrong OTP, attempt failed ${x.wrongAttempt}` });
      }
      if (user.otp === otp || (code == otp && user.isActive === true)) {
        await otpSchema.findOneAndUpdate({ phone: number }, { $set: { isActive: false } }, { new: true });
        const newUser = await Users.findOne({ phone: number }, { __v: 0, createdAt: 0, updatedAt: 0 });
        if (!newUser) {
          const userResponse = await admin.auth().createUser({
            phone: number,
            emailVerified: false,
            disabled: false,
          });

          const newUser = new Users({
            phone: number,
            uid: userResponse.uid,
            userType: "Client",
            deviceId: doc?.deviceId,
            deviceToken: doc?.deviceToken,
          });
          const result = await newUser.save();
          const token = jwt.sign({ userId: result._id, role: result.userType }, process.env.JWTSECRET, {
            expiresIn: "24h",
          });
          return res.status(200).json({ status: true, message: "Login Sucessfully", token, newUser: result });
        }
        await Users.findByIdAndUpdate({ _id: newUser.id }, { deviceId: doc?.deviceId, deviceToken: doc?.deviceToken }, { new: true });
        const token = jwt.sign({ userId: newUser._id, role: newUser.userType }, process.env.JWTSECRET, {
          expiresIn: "24h",
        });
        return res.status(200).json({ status: true, message: "Login Sucessfully", token, newUser });
      } else {
        return res.status(403).json({ status: false, message: "OTP has been used" });
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  addAmount: async (req, res) => {
    try {
      const amount = req.body.amount;
      const userId = req.userId;
      const data = {
        userId: userId,
        amount: amount,
      };
      const abc = await Users.findById({ _id: userId });
      if (!abc) {
        return res.status(200).json({ staus: false, message: "user not found" });
      }
      const nigga = await Users.findByIdAndUpdate({ _id: userId }, { $inc: { wallet: amount } }, { new: true });
      await transaction(data);
      return res.status(200).json({ status: true, message: "recharge successfull", AvailableBalance: `${nigga.wallet}` });
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  },
  allTransactions: async (req, res) => {
    try {
      // if(req.role !== "Admin"){
      //   return res.status(403).json({status:false, message:"Please Login as admin"});
      // }
      const result = await TransactionSchema.find();
      return res.status(200).json({ status: true, result, message: "sucesfully listng" });
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  },
  transactionsOfUser: async (req, res) => {
    try {
      const body = {
        userId: req.userId,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      };
      const condition = {};
      condition.userId = new mongoose.Types.ObjectId(body.userId);
      const amount = await Users.findById({ _id: body.userId }, { _id: 0, wallet: 1 });
      if (body.startDate && !body.endDate) {
        return "please enter end date as well";
      }
      if (body.startDate) {
        const edate = new Date(body.endDate.split("/").reverse().join("/"));
        const sdate = new Date(body.startDate.split("/").reverse().join("/"));
        condition.createdAt = { $gte: sdate, $lte: edate }; //I'll fix it soon
      }
      const passbook = await TransactionSchema.aggregate([
        { $match: condition },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            result: { $push: "$$ROOT" },
          },
        },
        {
          $sort: { _id: -1 },
        },
      ]);
      return res.status(200).json({ status: true, amount: amount.wallet, passbook, message: "listing successflly..." });
    } catch (error) {
      return res.status(403).json({ status: false, message: error.message });
    }
  },
};

const transaction = async (data) => {
  try {
    const transactionID = new Date(Date.now()).getTime();
    const newTransaction = new TransactionSchema({
      amount: data.amount,
      transactionType: "CREATED",
      transactionId: transactionID,
      userId: data.userId,
      gstAmount: 0,
      transactionMessage: `rechare of ${data.amount} is done.`,
    });
    const result = await newTransaction.save();
    return result;
  } catch (error) {
    return error.message;
  }
};
