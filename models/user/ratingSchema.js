const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    vendorId: {
      type: Number,
    },
    userId: {
      type: Number,
    },
    rate: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("rating", ratingSchema);
