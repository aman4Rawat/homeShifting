const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
   
  banner_main_image:{
    type:String
  },
  is_active: {
    type: Boolean,
    default: true,
  },
},{timestamps:true});

module.exports = mongoose.model("mainBanner", bannerSchema);