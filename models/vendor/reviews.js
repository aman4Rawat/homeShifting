const mongoose = require("mongoose");

const reviewaSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
    review:{
       type: String, 
    },
    rating:{
        type:Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("review", reviewaSchema);