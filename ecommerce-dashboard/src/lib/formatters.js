export const formatCurrency = (n) =>
  n?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export const formatCurrencyCompact = (n) =>
  n?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  });

export const formatPct = (n, digits = 2) => `${Number(n).toFixed(digits)}%`;

export const parseISO = (s) => new Date(s);

export const clampSeriesByDate = (series, start, end) =>
  series.filter((d) => {
    const t = new Date(d.date).getTime();
    return (!start || t >= start.getTime()) && (!end || t <= end.getTime());
  });
