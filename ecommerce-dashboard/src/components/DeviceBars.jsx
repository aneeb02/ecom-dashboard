import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { formatCurrency } from "../lib/formatters";

export default function DeviceBars({ data }){
  const rows = [...data].sort((a,b)=> b.revenue - a.revenue);
  return (
    <div className="card" style={{height:260}}>
      <div className="kpi-title"><b>Ecommerce Revenue</b> and <b style={{color:"var(--accent-orange)"}}>Conversion Rate</b> by Device</div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{left:100, top:10, right:30}}>
          <CartesianGrid stroke="#f0f0f0"/>
          <XAxis type="number" tickFormatter={formatCurrency}/>
          <YAxis type="category" dataKey="device" />
          <Tooltip formatter={(v, n)=> n==="revenue" ? formatCurrency(v) : `${v.toFixed(2)}%`} />
          <Bar dataKey="revenue" fill="var(--accent-blue)" radius={[4,4,4,4]}>
            <LabelList dataKey="revenue" position="insideRight" formatter={formatCurrency} />
          </Bar>
          <LabelList dataKey={() => ""}/>
        </BarChart>
      </ResponsiveContainer>
      <div className="legend">Conversion rates shown as labels on the right</div>
    </div>
  );
}
