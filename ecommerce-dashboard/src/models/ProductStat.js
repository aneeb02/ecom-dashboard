const { Schema, model } = require("mongoose");

const productStatSchema = new Schema({
  product: { type: String, required: true, index: true },
  revenue: { type: Number, required: true },
  conversionRate: { type: Number, required: true }
}, { timestamps: true });

module.exports = model("ProductStat", productStatSchema);
