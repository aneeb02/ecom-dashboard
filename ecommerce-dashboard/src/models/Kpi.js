const { Schema, model } = require("mongoose");

const kpiSchema = new Schema({
  periodStart: { type: Date, index: true }, 
  ecommerceRevenue: Number,
  newCustomers: Number,
  repeatPurchaseRate: Number,
  averageOrderValue: Number,
  ecommerceConversionRate: Number,
}, { timestamps: true });

module.exports = model("Kpi", kpiSchema);
