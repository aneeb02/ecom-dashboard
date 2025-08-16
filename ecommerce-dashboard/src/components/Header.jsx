export default function Header({ range, setRange }){
  return (
    <>
      <div className="header">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src="/logo-penpath.svg" alt="" style={{height:18}} />
          <div className="title">Ecommerce Performance Overview</div>
        </div>
        <div className="controls">
          <span className="badge">Start Date</span>
          <DatePicker selected={range.start} onChange={(d)=> d && setRange(r=>({...r, start:d}))} className="select" dateFormat="M/d/yyyy"/>
          <span className="badge">End Date</span>
          <DatePicker selected={range.end} onChange={(d)=> d && setRange(r=>({...r, end:d}))} className="select" dateFormat="M/d/yyyy"/>
          <span className="badge">Comparison Period</span>
          <select className="select" defaultValue="Previous Year">
            <option>Previous Year</option>
            <option>Previous Period</option>
          </select>
          <button className="btn primary" style={{padding:"8px 14px"}}>View All Dashboards</button>
        </div>
      </div>
      <div style={{borderBottom:`1px solid var(--border)`,marginBottom:12}}/>
    </>
  );
}
