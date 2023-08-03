const mongoose = require("mongoose");

const gallarySchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("gallary", gallarySchema);