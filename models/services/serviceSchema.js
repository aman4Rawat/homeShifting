const mongoose = require("mongoose");

const serviceSchemas = new mongoose.Schema({
   
  image:{
    type:String
  },
  name:{
    type:String
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});

const subCategorySchema = new mongoose.Schema({
   
  name:{
    type:String,
    unique:true
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"category"
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});


const serviceSchema = mongoose.model("service", serviceSchemas);
const subCategory =mongoose.model("subCategory", subCategorySchema);

module.exports = {subCategory,serviceSchema}

