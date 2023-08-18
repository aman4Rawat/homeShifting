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

const vendorPaymentTypeSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    phonePay:{
        type:Boolean,
        default:false
    },
    googlePay:{
        type:Boolean,
        default:false
    },
    paytm:{
        type:Boolean,
        default:false
    },
    debitCardCreditCard:{
        type:Boolean,
        default:false
    },
    netBanking:{
        type:Boolean,
        default:false
    },
    cashOnDelivery:{
        type:Boolean,
        default:false
    },
    check:{
        type:Boolean,
        default:false
    },
    IMPS:{
        type:Boolean,
        default:false
    },
  },
  { timestamps: true }
);

const socialMediaSchemas = mongoose.model("socialMedia", socialMediaSchema);
const vendorPaymentTypeSchemas = mongoose.model("venderPaymentType", vendorPaymentTypeSchema);

module.exports = {socialMediaSchemas,vendorPaymentTypeSchemas}