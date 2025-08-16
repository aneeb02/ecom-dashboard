// src/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { connectDB } = require('./db/connection');
const Kpi = require('./models/Kpi');
const RevenuePoint = require('./models/RevenuePoint');
const ProductStat = require('./models/ProductStat');
const ChannelStat = require('./models/ChannelStat');
const StateRevenue = require('./models/StateRevenue');
const DeviceStat = require('./models/DeviceStat');

// --- Create app & middleware ---
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// --- Connect to Mongo ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecom_dashboard';
connectDB(MONGODB_URI);

// ---- Routes ----

// health
app.get('/health', (_req, res) => res.json({ ok: true }));

// KPIs
app.get('/api/kpis', async (req, res, next) => {
  try {
    const doc = await Kpi.findOne({}, null, { sort: { createdAt: -1 } }).lean();
    res.json({
      kpis: doc ? {
        ecommerceRevenue: doc.ecommerceRevenue,
        newCustomers: doc.newCustomers,
        repeatPurchaseRate: doc.repeatPurchaseRate,
        averageOrderValue: doc.averageOrderValue,
        ecommerceConversionRate: doc.ecommerceConversionRate
      } : {}
    });
  } catch (e) { next(e); }
});

// Revenue over time (weekly/monthly)
app.get('/api/revenue-over-time', async (req, res, next) => {
  try {
    const start = req.query.start ? new Date(req.query.start) : null;
    const end = req.query.end ? new Date(req.query.end) : null;
    const unit = (req.query.breakdown || 'weekly') === 'monthly' ? 'month' : 'week';

    const match = {};
    if (start) match.date = { ...match.date, $gte: start };
    if (end) match.date = { ...match.date, $lte: end };

    const rows = await RevenuePoint.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateTrunc: { date: '$date', unit } },
          revenue: { $sum: '$revenue' },
          conversionRate: { $avg: '$conversionRate' }
        }
      },
      { $project: { _id: 0, date: '$_id', revenue: 1, conversionRate: 1 } },
      { $sort: { date: 1 } }
    ]);

    res.json({ revenueOverTime: rows, meta: { breakdown: unit } });
  } catch (e) { next(e); }
});

// Products
app.get('/api/products', async (_req, res, next) => {
  try {
    const rows = await ProductStat.find({}).sort({ revenue: -1 }).lean();
    res.json({ productPerformance: rows });
  } catch (e) { next(e); }
});

// Channels
app.get('/api/channels', async (_req, res, next) => {
  try {
    const rows = await ChannelStat.find({}).sort({ revenue: -1 }).lean();
    res.json({ marketingChannels: rows });
  } catch (e) { next(e); }
});

// States
app.get('/api/states', async (_req, res, next) => {
  try {
    const rows = await StateRevenue.find({}).lean();
    res.json({ statePerformance: rows });
  } catch (e) { next(e); }
});

// Devices
app.get('/api/devices', async (_req, res, next) => {
  try {
    const rows = await DeviceStat.find({}).sort({ revenue: -1 }).lean();
    res.json({ devicePerformance: rows });
  } catch (e) { next(e); }
});

// 404 + error handlers
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
