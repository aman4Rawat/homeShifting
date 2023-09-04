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

const suggestionPlaneSchemas = new mongoose.Schema(
  {
    amount: {
        type: Number,
    },
  },
  { timestamps: true }
);

const paymentSchema = mongoose.model("payment", paymentSchemas);
const suggestionPlaneSchema = mongoose.model("suggestionPlane", suggestionPlaneSchemas);

module.exports = {paymentSchema,suggestionPlaneSchema}