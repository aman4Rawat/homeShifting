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
    vendorId: {
      type: mongoose.Types.ObjectId,
      ref:"venderBusiness",
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bestdeal", bestDealSchema);
//populate use krna hai ref pr.