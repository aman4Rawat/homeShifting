const mongoose = require("mongoose");

const vendorBusinessSchema = new mongoose.Schema(
  {
    bgImage: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default:false,
    },
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
    whatsappNumber: {
      type: Number,
    },
    pinCode:{
        type:Number,
    },
    startTime:{
        type:String,
    },
    endTime:{
        type:String,
    },
    yearOfEsteblish:{
        type:String,
    },
    aadharImage:{
        type:String,
    },
    panImage:{
        type:String,
    },
    companyCertificateImage:{
        type:String,
    },
    otherDocumentImage:{
        type:String,
    },
    aadharImageVerified:{
        type:Boolean,
        default:false
    },
    panImageVerified:{
        type:Boolean,
        default:false,
    },
    companyCertificateImageVerified:{
        type:Boolean,
        default:false
    },
    otherDocumentImageVerified:{
        type:Boolean,
        default:false
    },
    categoryId:{
      type:String
    },
    categoryName:{
      type:String
    },
    
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("venderBusiness", vendorBusinessSchema);
