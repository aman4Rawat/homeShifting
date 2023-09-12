const mongoose = require("mongoose");

const passbookSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    title: {
      type: String,
    },
    amount: {
        type: Number,
    },
    transactionType: {
        type: String,
    },
    availableBalance: {
        type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("passbook", passbookSchema);