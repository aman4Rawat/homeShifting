const mongoose = require("mongoose");

const optionsSchema = new mongoose.Schema({
   
  name:{
    type:String
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  descriptions:{
    type:String
  },
  amount:{
    type:Number,
    default:0
  },
  image:{
    type:String,
  }
},{timestamps:true});

module.exports = mongoose.model("package_Oprions", optionsSchema);