const { Schema, model } = require("mongoose");

const channelStatSchema = new Schema({
  channel: { type: String, required: true, index: true },
  revenue: { type: Number, required: true },
  conversionRate: { type: Number, required: true }
}, { timestamps: true });

module.exports = model("ChannelStat", channelStatSchema);
