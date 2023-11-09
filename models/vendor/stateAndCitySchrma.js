const mongoose = require("mongoose");

const state = new mongoose.Schema(
  {
    name: { type: String },
    state_code: { type: String, unique: true },
    value: { type: String, unique: true },
  },
  {
    timestamps: false,
    collection: 'state',
  }
);

const city = new mongoose.Schema(
  {
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'state', required: true },
    stateName:{type:String},
    name: { type: String },
    value: { type: String },
  },
  {
    timestamps: false,
    collection: 'city',
  }
);

const locality = new mongoose.Schema(
  {
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'city', required: true },
    cityName: {type:String},
    stateName:{type:String},
    name: { type: String },
    isActive: {type: Boolean, default: true },
  },
  {
    timestamps: false,
    collection: 'locality',
  }
);
city.index({state:1});
locality.index({city:1});
const State = mongoose.model("state", state);
const City = mongoose.model("city", city);
const Locality = mongoose.model("locality", locality);

module.exports = {State,City,Locality}