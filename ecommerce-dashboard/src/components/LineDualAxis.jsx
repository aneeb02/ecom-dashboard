import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "../lib/formatters";

export default function LineDualAxis({ data }) {
  const fmtPct = (n) => `${(n * 100).toFixed(2)}%`;
  return (
    <div className="card" style={{ height: 300 }}>
      <div className="kpi-title">
        <b>Ecommerce Revenue</b> and{" "}
        <b style={{ color: "var(--accent-orange)" }}>
          Ecommerce Conversion Rate
        </b>{" "}
        Over Time
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={(s) =>
              new Date(s).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis yAxisId="left" tickFormatter={formatCurrency} />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={fmtPct}
            domain={[0, 0.16]}
          />
          <Tooltip
            formatter={(v, n) =>
              n === "revenue" ? formatCurrency(v) : fmtPct(v)
            }
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="var(--accent-blue)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="conversionRate"
            stroke="var(--accent-orange)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
