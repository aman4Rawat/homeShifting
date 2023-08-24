const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
   
  image:{
    type:String
  },
  name:{
    type:String
  },
  serviceId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'service'
  },
  serviceName:{
    type:String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
},{timestamps:true});

module.exports = mongoose.model("category", categorySchema);