const mongoose = require("mongoose");

const vendorBusinessSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
    },
    contactPersonName: {
      type: String,
    },
    area: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    pinCode:{
        type:Number,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("venderBusiness", vendorBusinessSchema);
