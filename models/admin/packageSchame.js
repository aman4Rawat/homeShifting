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
},{timestamps:true});

module.exports = mongoose.model("package", packageSchame);