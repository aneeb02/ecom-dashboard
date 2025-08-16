const { Schema, model } = require("mongoose");

const revenuePointSchema = new Schema({
  date: { type: Date, required: true, index: true },
  revenue: { type: Number, required: true },
  conversionRate: { type: Number, required: true } // store percent as fraction (0.12)
}, { timestamps: true });

revenuePointSchema.index({ date: 1 });

module.exports = model("RevenuePoint", revenuePointSchema);
