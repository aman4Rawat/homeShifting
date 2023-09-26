const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
   
  image:{
    type:String
  },
  name:{
    type:String
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});

module.exports = mongoose.model("service", serviceSchema);