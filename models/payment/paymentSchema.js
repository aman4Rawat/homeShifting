const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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
    orderId: {
        type: String,
    },
    referenceId: {
        type: String,
    },
    paymentMode: {
        type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);