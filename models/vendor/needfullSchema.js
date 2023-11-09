const mongoose = require("mongoose");

const nameUpdateRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"venderBusiness"
    },
    name:{
    type: String,
   },
  },
  { timestamps: true }
);

const nameUpdateRequest = mongoose.model("updateNameRequest", nameUpdateRequestSchema);

module.exports = {nameUpdateRequest}