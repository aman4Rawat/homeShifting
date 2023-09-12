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
    isExpert: {
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
        default:"0",
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
    uniqueId:{
      type:String
    },
    email:{
      type:String
    },
    designation:{
      type:String
    },
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    timing:{
      type:Array,
    },
    address:[],
    paymentType:[],
    rating:{type:Number,},
    ratingCount:{type:Number,},
    wallet:{type:Number,default:0,},
    packageId:{type:mongoose.Schema.Types.ObjectId,ref:"package"},
    packagePurchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pruchasedPackage",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("venderBusiness", vendorBusinessSchema);
