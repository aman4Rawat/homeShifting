const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: "{VALUE} is not a valid email",
    },
  },
  mobile_number: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: "{VALUE} is not a valid mobile number!",
    },
  },
  profile_image:{
    type:String
  },
  gender:{
    type:String
  },

  is_active: {
    type: Boolean,
    default: true,
  },
},{timestamps:true});

module.exports = mongoose.model("user", userSchema);