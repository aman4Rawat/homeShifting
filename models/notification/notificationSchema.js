const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    userId: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    from: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);