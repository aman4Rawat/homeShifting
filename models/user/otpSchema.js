const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    mobile_number: {
      type: Number,
    },
    otp: {
      type: Number,
    },
    expire_time: {
      type: String,
    },
    wrong_attempt: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", otpSchema);
