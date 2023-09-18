const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "venderBusiness",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("invoice", invoiceSchema);