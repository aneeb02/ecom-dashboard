import { formatCurrency, formatPct } from "../lib/formatters";

const items = [
  { key: "ecommerceRevenue", label: "Ecommerce Revenue", type:"currency", delta:+10.62 },
  { key: "newCustomers", label: "New Customers", type:"int", delta:-22.66 },
  { key: "repeatPurchaseRate", label: "Repeat Purchase Rate", type:"pct0", delta:+41.12 },
  { key: "averageOrderValue", label: "Average Order Value", type:"currency2", delta:-12.10 },
  { key: "ecommerceConversionRate", label: "Ecommerce Conversion Rate", type:"pct2", delta:+0.98 },
];

function Value({type, value}){
  if(type==="currency" || type==="currency2") return <div className="kpi-value">{formatCurrency(value)}</div>;
  if(type==="pct0") return <div className="kpi-value">{formatPct(value,2)}</div>;
  if(type==="pct2") return <div className="kpi-value">{formatPct(value,2)}</div>;
  return <div className="kpi-value">{value?.toLocaleString()}</div>;
}

export default function KpiGrid({ kpis }){
  return (
    <div className="grid kpi-grid">
      {items.map(it=>{
        const v = kpis[it.key];
        const up = it.delta >= 0;
        return (
          <div className="card" key={it.key}>
            <div className="kpi-title">{it.label}</div>
            <Value type={it.type} value={v}/>
            <div className="kpi-delta" style={{color: up ? "var(--up)" : "var(--down)"}}>
              {up ? "▲" : "▼"} {Math.abs(it.delta).toFixed(2)}%
            </div>
          </div>
        )
      })}
    </div>
  );
}
