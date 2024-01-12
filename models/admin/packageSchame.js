const mongoose = require("mongoose");

const packageSchame = new mongoose.Schema(
  {
    packageName: {
      type: String,
      enum: ["silver", "gold", "platinum"],
    },
    packageAmount: {
      type: Number,
    },
    packageDuration: {
      type: Number,
      enum: [3, 6, 12, 18, 24, 30, 36],
    },
    packageDetails: [],
    callCharges: { type: Number },
    socialMediaCharges: { type: Number },
    websiteCharges: { type: Number },
    directionCharges: { type: Number },
    inqueryCharges: { type: Number },
    othersCharges: { type: Number },
    chatCharges: { type: Number },
    bestDealCharges: { type: Number },
    serviceId: { type: String, ref: "service" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("package", packageSchame);
