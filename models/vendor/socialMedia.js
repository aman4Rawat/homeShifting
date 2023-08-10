const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    website:{
      type:String,
    },
    facebook:{
      type:String,
    },
    instagram:{
      type:String,
    },
    twitter:{
      type:String,
    },
    youtube:{
      type:String,
    },
    linkedin:{
      type:String,
    },
    whatsapp:{
      type:String,
    },
    snapchat:{
      type:String,
    },
    other:{
      type:String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("socialMedia", socialMediaSchema);