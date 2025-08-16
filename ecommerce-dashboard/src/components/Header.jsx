import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Header({ range, setRange }) {
  return (
    <div className="header">
      <div>
        <div className="title">Ecommerce Performance Overview</div>
        <div className="badge">Start Date</div>
      </div>
      <div className="controls">
        <span className="badge">Start</span>
        <DatePicker
          selected={range.start}
          onChange={(d) => d && setRange((r) => ({ ...r, start: d }))}
          className="select"
          dateFormat="MM/dd/yyyy"
        />
        <span className="badge">End</span>
        <DatePicker
          selected={range.end}
          onChange={(d) => d && setRange((r) => ({ ...r, end: d }))}
          className="select"
          dateFormat="MM/dd/yyyy"
        />
        <select className="select" defaultValue="Previous Year">
          <option>Previous Year</option>
          <option>Previous Period</option>
        </select>
        <button className="btn primary">View All Dashboards</button>
      </div>
    </div>
  );
}
