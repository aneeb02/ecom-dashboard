const { parseISO, isValid, startOfWeek, startOfMonth, formatISO } = require("date-fns");

function parseDateSafe(v) {
  if (!v) return null;
  const d = parseISO(v);
  return isValid(d) ? d : null;
}

function clampSeries(series, start, end) {
  if (!start && !end) return series;
  const s = start?.getTime?.();
  const e = end?.getTime?.();
  return series.filter(d => {
    const t = parseISO(d.date).getTime();
    if (s && t < s) return false;
    if (e && t > e) return false;
    return true;
  });
}

/** Aggregate to week or month. */
function aggregate(series, breakdown = "weekly") {
  if (!Array.isArray(series) || !series.length) return [];
  const groupFn = breakdown === "monthly"
    ? (d) => formatISO(startOfMonth(parseISO(d.date)), { representation: "date" })
    : (d) => formatISO(startOfWeek(parseISO(d.date), { weekStartsOn: 0 }), { representation: "date" });

  const map = new Map();
  for (const row of series) {
    const key = groupFn(row);
    const acc = map.get(key) || { date: key, revenue: 0, _crSum: 0, _n: 0 };
    acc.revenue += Number(row.revenue || 0);
    acc._crSum += Number(row.conversionRate || 0);
    acc._n += 1;
    map.set(key, acc);
  }
  const out = Array.from(map.values())
    .map(d => ({ date: d.date, revenue: d.revenue, conversionRate: d._n ? d._crSum / d._n : 0 }))
    .sort((a, b) => parseISO(a.date) - parseISO(b.date));
  return out;
}

function pick(obj, keys) {
  if (!keys) return obj;
  const allow = new Set(keys);
  const out = {};
  for (const k of Object.keys(obj)) if (allow.has(k)) out[k] = obj[k];
  return out;
}

module.exports = { parseDateSafe, clampSeries, aggregate, pick };
