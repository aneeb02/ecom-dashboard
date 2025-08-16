const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const data = require("./data");
const { parseDateSafe, clampSeries, aggregate, pick } = require("./utils");

const app = express();

// Basic hardening & DX
app.use(cors());            // allow your Vite frontend
app.use(express.json());
app.use(morgan("dev"));

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

/**
 * Query helpers:
 *  - start, end: YYYY-MM-DD
 *  - breakdown: weekly | monthly (default weekly)
 *  - kpis: comma-separated list to filter KPI keys (optional)
 */
function parseCommon(req) {
  const start = parseDateSafe(req.query.start);
  const end = parseDateSafe(req.query.end);
  const breakdown = (req.query.breakdown || "weekly").toLowerCase();
  const kpis = req.query.kpis
    ? req.query.kpis.split(",").map(s => s.trim()).filter(Boolean)
    : null;
  return { start, end, breakdown, kpis };
}

// ---- KPIs ----
app.get("/api/kpis", (req, res) => {
  const { kpis: keys } = parseCommon(req);
  // In a real backend, you'd recompute KPIs for the date range.
  // For now we return the sample values, with optional key filtering.
  const body = { kpis: keys ? pick(data.kpis, keys) : data.kpis };
  res.json(body);
});

// ---- Revenue over time (supports breakdown + date) ----
app.get("/api/revenue-over-time", (req, res) => {
  const { start, end, breakdown } = parseCommon(req);
  const clamped = clampSeries(data.revenueOverTime, start, end);
  const grouped = aggregate(clamped, breakdown);
  res.json({ revenueOverTime: grouped, meta: { breakdown } });
});

// ---- Product performance ----
app.get("/api/products", (req, res) => {
  // If you later store product metrics per day, filter by date here.
  res.json({ productPerformance: data.productPerformance });
});

// ---- Marketing channel performance ----
app.get("/api/channels", (req, res) => {
  res.json({ marketingChannels: data.marketingChannels });
});

// ---- Revenue by state ----
app.get("/api/states", (req, res) => {
  res.json({ statePerformance: data.statePerformance });
});

// ---- Revenue by device ----
app.get("/api/devices", (req, res) => {
  res.json({ devicePerformance: data.devicePerformance });
});

// 404 + error handlers
app.use((req, res) => res.status(404).json({ error: "Not Found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
