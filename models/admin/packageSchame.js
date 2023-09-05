const mongoose = require("mongoose");

const packageSchame = new mongoose.Schema({
   
  packageName:{
    type:String,
  },
  packageAmount: {
    type: Number,
  },
  packageDuration: {
    type: Number,
    enum:[3,6,12,18,24]
  },
  packageDetalis: [],
  callCharges: {type:Number},
  socialMediaCharges: {type:Number},
  websiteCharges: {type:Number},
  directionCharges: {type:Number},
  inqueryCharges: {type:Number},
  othersCharges:{type:Number},
  chatCharges:{type:Number},
  bestDealCharges: {type:Number},
},{timestamps:true});

module.exports = mongoose.model("package", packageSchame);