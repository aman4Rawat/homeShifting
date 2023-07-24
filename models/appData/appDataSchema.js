const mongoose = require("mongoose");

const appDataSchema = new mongoose.Schema(
  {
    aboutUs: {
      type: String,
    },
    termAndCondition: {
      type: String,
    },
    privacyAndPolicy: {
      type: String,
    },
    FAQ: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("appData", appDataSchema);