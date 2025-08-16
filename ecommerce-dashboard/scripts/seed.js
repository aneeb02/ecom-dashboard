/* eslint-disable no-console */
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const { connectDB } = require("../src/db/connection");

const Kpi = require("../src/models/Kpi");
const RevenuePoint = require("../src/models/RevenuePoint");
const ProductStat = require("../src/models/ProductStat");
const ChannelStat = require("../src/models/ChannelStat");
const StateRevenue = require("../src/models/StateRevenue");
const DeviceStat = require("../src/models/DeviceStat");

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");

  const conn = await connectDB(uri);
  console.log("Connected:", conn.name);

  // Load mock JSON
  const file = path.join(__dirname, "..", "mock", "dashboard.json");
  const raw = fs.readFileSync(file, "utf-8");
  const mock = JSON.parse(raw);

  // Clean collections (idempotent seed)
  await Promise.all([
    Kpi.deleteMany({}),
    RevenuePoint.deleteMany({}),
    ProductStat.deleteMany({}),
    ChannelStat.deleteMany({}),
    StateRevenue.deleteMany({}),
    DeviceStat.deleteMany({}),
  ]);

  // KPIs: single snapshot row (you can expand to multiple periods later)
  await Kpi.create({
    periodStart: new Date("2020-02-01"),
    ...mock.kpis
  });

  // Time series
  await RevenuePoint.insertMany(
    mock.revenueOverTime.map(d => ({
      date: new Date(d.date),
      revenue: d.revenue,
      conversionRate: d.conversionRate
    }))
  );

  // Products
  await ProductStat.insertMany(mock.productPerformance);

  // Channels
  await ChannelStat.insertMany(mock.marketingChannels);

  // States
  await StateRevenue.insertMany(mock.statePerformance);

  // Devices
  await DeviceStat.insertMany(mock.devicePerformance);

  console.log("Seed complete");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});