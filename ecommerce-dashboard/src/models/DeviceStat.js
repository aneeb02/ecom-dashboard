const { Schema, model } = require("mongoose");

const deviceStatSchema = new Schema({
  device: { type: String, required: true, index: true }, // Desktop | Mobile | Tablet
  revenue: { type: Number, required: true },
  conversionRate: { type: Number, required: true }
}, { timestamps: true });

module.exports = model("DeviceStat", deviceStatSchema);
