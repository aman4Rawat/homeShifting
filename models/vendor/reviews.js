const mongoose = require("mongoose");

const reviewaSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"venderBusiness"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"user"
    },
    review:{
       type: String, 
    },
    rating:{
        type:Number,
    },
    response:[],
  },
  { timestamps: true }
);
const suggestionSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    subject:{
       type: String, 
    },
    description:{
        type:String,
    },
    status:{
      type: Boolean,
      default:false
    },
  },
  { timestamps: true }
);

const suggestionsSchema = mongoose.model("suggestion", suggestionSchema);
const reviewsSchema = mongoose.model("review", reviewaSchema);

module.exports = {suggestionsSchema,reviewsSchema}