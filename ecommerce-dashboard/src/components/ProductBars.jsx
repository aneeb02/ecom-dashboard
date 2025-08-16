import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from "recharts";
import { formatCurrency, formatPct } from "../lib/formatters";

export default function ProductBars({ data }) {
  const rows = [...data].sort((a, b) => b.revenue - a.revenue);
  return (
    <div className="card" style={{ height: 340 }}>
      <div className="kpi-title">
        <b>Ecommerce Revenue</b> and{" "}
        <b style={{ color: "var(--accent-orange)" }}>
          Ecommerce Conversion Rate
        </b>{" "}
        by Product
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ left: 80, top: 10, right: 30 }}
        >
          <CartesianGrid stroke="#f0f0f0" />
          <XAxis type="number" tickFormatter={formatCurrency} />
          <YAxis type="category" dataKey="product" />
          <Tooltip
            formatter={(v, n) =>
              n === "revenue" ? formatCurrency(v) : formatPct(v, 2)
            }
          />
          <Bar
            dataKey="revenue"
            fill="var(--accent-blue)"
            radius={[4, 4, 4, 4]}
          >
            <LabelList
              dataKey="revenue"
              position="right"
              formatter={(v) => formatCurrency(v)}
            />
          </Bar>
          {/* slim overlay bar to visualize conversion rate */}
          <Bar
            dataKey="conversionRate"
            xAxisId={1}
            fill="var(--accent-orange)"
            barSize={6}
          >
            <LabelList
              dataKey="conversionRate"
              position="right"
              formatter={(v) => formatPct(v, 2)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
