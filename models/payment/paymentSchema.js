const mongoose = require("mongoose");

const paymentSchemas = new mongoose.Schema(
  {
    paymentId: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "business",
    },
    paymentStatus: {
      type: String,
    },
    amount: {
        type: Number,
    },
    paidAmount: {
        type: Number,
    },
    gstAmount:{
        type: Number,
    },
    orderId: {
        type: String,
    },
    referenceId: {
        type: String,
    },
    paymentMode: {
        type: String,
    },
    productName: {
        type: String,
    },

  },
  { timestamps: true }
);

const suggestionPlaneSchemas = new mongoose.Schema(
  {
    amount: {
        type: Number,
    },
  },
  { timestamps: true }
);


const pruchasedPackageSchemas = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "package",
    },
    amount: {
      type: Number,
    },
    orderId: {
      type: String,
    },
    paidAmount: {
      type: String,
    },
    gstAmount: {
      type: String,
    },
    package:  {
      type: Object,
    },
    expireDate: {
      type: Date,
    },
    paymentStatus: {
      type: String,
    },
  },{ timestamps: true });

const paymentSchema = mongoose.model("payment", paymentSchemas);
const suggestionPlaneSchema = mongoose.model("suggestionPlane", suggestionPlaneSchemas);
const pruchasedPackageSchema = mongoose.model("pruchasedPackage", pruchasedPackageSchemas);

module.exports = {paymentSchema,suggestionPlaneSchema,pruchasedPackageSchema}