export default function Filters({
  kpi1,
  setKpi1,
  kpi2,
  setKpi2,
  breakdown,
  setBreakdown,
}) {
  const KPI_OPTIONS = ["Ecommerce Revenue", "Ecommerce Conversion Rate"];
  return (
    <div
      className="card"
      style={{ display: "flex", gap: 12, alignItems: "center" }}
    >
      <span className="badge">KPI1</span>
      <select
        className="select"
        value={kpi1}
        onChange={(e) => setKpi1(e.target.value)}
      >
        {KPI_OPTIONS.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <span className="badge">KPI2</span>
      <select
        className="select"
        value={kpi2}
        onChange={(e) => setKpi2(e.target.value)}
      >
        {KPI_OPTIONS.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <span className="badge">Date Breakdown</span>
      <select
        className="select"
        value={breakdown}
        onChange={(e) => setBreakdown(e.target.value)}
      >
        <option>Weekly</option>
        <option>Monthly</option>
      </select>
    </div>
  );
}
