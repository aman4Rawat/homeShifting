const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    website:{
      type:String,
      default: "",
      
    },
    facebook:{
      type:String,
      default: "",
    },
    instagram:{
      type:String,
      default: "",
    },
    twitter:{
      type:String,
      default: "",
    },
    youtube:{
      type:String,
      default: "",
    },
    linkedin:{
      type:String,
      default: "",
    },
    other:{
      type:String,
      default: "",
    },
  },
  { timestamps: true }
);

const clicksSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"venderBusiness"
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
   clickType:{
    type: String,
    enum : ["WEBSITE",'SOCIAL','CALL','BESTDEAL','DIRECTION','CHAT', 'INQUERY','OTHERS'],
   },
   name:{
    type: String,
    enum : ['FACEBOOK','INSTAGRAM','TWITTER','YOUTUBE','LINKEDIN','OTHERS','SNAPCHAT'],
   },
   userName:{
    type:String,
   },
   userNumber:{
    type:String,
   },
   userEmail:{
    type:String,
   },
   userQuery:{
    type:String,
    default:null,
   },
   isNaya:{
    type:Boolean,
    default:true,
   },
   isRead:{
    type:Boolean,
    default:false,
   },
  },
  { timestamps: true }
);

const socialMediaSchemas = mongoose.model("socialMedia", socialMediaSchema);
const clickSchema = mongoose.model("click", clicksSchema);

module.exports = {socialMediaSchemas,clickSchema}