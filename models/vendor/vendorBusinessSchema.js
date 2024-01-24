const { string } = require("joi");
const mongoose = require("mongoose");

const vendorBusinessSchema = new mongoose.Schema(
  {
    bgImage: {
      type: String,
      default: "http://13.48.193.62:3001/image/i/noImage.png",
    },
    profileImage: {
      type: String,
      default: "http://13.48.193.62:3001/image/i/noImage.png",
    },
    name: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isExpert: {
      type: Boolean,
      default: false,
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
    pinCode: {
      type: Number,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: String,
      default: "08:00 AM",
    },
    endTime: {
      type: String,
      default: "09:00 PM",
    },
    yearOfEsteblish: {
      type: String,
      default: "0",
    },
    aadharImage: {
      type: String,
    },
    panImage: {
      type: String,
    },
    companyCertificateImage: {
      type: String,
    },
    otherDocumentImage: {
      type: String,
    },
    aadharImageVerified: {
      type: Boolean,
      default: false,
    },
    panImageVerified: {
      type: Boolean,
      default: false,
    },
    companyCertificateImageVerified: {
      type: Boolean,
      default: false,
    },
    otherDocumentImageVerified: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: String,
    },
    categoryName: {
      type: String,
    },
    uniqueId: {
      type: String,
    },
    email: {
      type: String,
    },
    designation: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    bannerImage: {
      type: String,
    },
    address: [],
    paymentType: [],
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    wallet: { type: Number, default: 0 },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "package" },
    packagePurchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pruchasedPackage",
    },
    latitute: { type: String },
    longitute: { type: String },
    services: { type: Array },
    searchAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("venderBusiness", vendorBusinessSchema);
