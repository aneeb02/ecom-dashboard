const { Schema, model } = require("mongoose");

const stateRevenueSchema = new Schema({
  state: { type: String, required: true, index: true },
  revenue: { type: Number, required: true }
}, { timestamps: true });

module.exports = model("StateRevenue", stateRevenueSchema);
