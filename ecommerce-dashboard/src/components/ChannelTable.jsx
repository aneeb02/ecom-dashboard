import { formatCurrency, formatPct } from "../lib/formatters";

export default function ChannelTable({ data }){
  const max = Math.max(...data.map(d=>d.revenue));
  return (
    <div className="card">
      <div className="kpi-title"><b>Attributed Revenue</b> and <b style={{color:"var(--accent-orange)"}}>Conversion Rate</b> by Marketing Channel</div>
      <table className="table">
        <tbody>
          {data.map((row)=>(
            <tr key={row.channel}>
              <td className="td" style={{width:"30%"}}>{row.channel}</td>
              <td className="td" style={{width:"25%"}}><b>{formatCurrency(row.revenue)}</b></td>
              <td className="td" style={{width:"30%"}}>
                <div className="progress"><span style={{width:`${(row.revenue/max)*100}%`, background:"var(--accent-blue)"}}/></div>
              </td>
              <td className="td" style={{width:"15%", textAlign:"right"}}>
                <span className="badge">{formatPct(row.conversionRate,2)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
