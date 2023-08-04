const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    links: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("socialMedia", socialMediaSchema);