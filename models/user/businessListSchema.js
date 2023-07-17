const mongoose = require("mongoose");

const businessListSchema = new mongoose.Schema(
  {
    mobile_number: {
      type: Number, 
    },
    fullName: {
      type: String,
    },
    userId: {
      type: String,
    },
    businessName: {
      type: String,
    },
    pinCode: {
      type: Number,
    },
    city: {
      type: String,
    },
    status:{
      type:Boolean,
      default:true
    },
    requestType:{
      type:String,
      enum:["Advertising","Business"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("businessAdvertising", businessListSchema);
