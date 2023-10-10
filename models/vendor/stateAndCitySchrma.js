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
    name: { type: String },
    value: { type: String },
  },
  {
    timestamps: false,
    collection: 'city',
  }
);
city.index({state:1});
const State = mongoose.model("state", state);
const City = mongoose.model("city", city);

module.exports = {State,City}