const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
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
    type:String,
    default:"http://13.48.193.62:3001/image/i/noImage.png"
  },
  background_image:{
    type:String,
    default:"http://13.48.193.62:3001/image/i/noImage.png"
  },
  gender:{
    type:String,
    default:"Male"
  },
  dob:{
    type:String,
    default:""
  },
  refCode:{
    type:String
  },
  role:{
    type: String,
    enum : ["USER","VENDOR","ADMIN"],
    default: "USER"
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  businessId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"venderBusiness"
  },
},{timestamps:true});

module.exports = mongoose.model("user", userSchema);