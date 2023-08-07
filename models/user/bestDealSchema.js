const mongoose = require("mongoose");

const bestDealSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    query: {
      type: String,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"venderBusiness",
    },
    userId: {
      type: String,
    },
    enqueryType: {
      type: String,
    },
    categoryId: {
      type: String,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"service",
    },
    isComplete:{
        type:Boolean,
        default:false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bestdeal", bestDealSchema);
//populate use krna hai ref pr.