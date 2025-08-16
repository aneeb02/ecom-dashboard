import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Header({ range, setRange, lastUpdated, isRefreshing, refreshData }) {
  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  const getStatusColor = () => {
    if (!lastUpdated) return '#999';
    const now = new Date();
    const diffMinutes = (now - lastUpdated) / (1000 * 60);
    if (diffMinutes < 1) return '#22c55e'; // Fresh - green
    if (diffMinutes < 5) return '#eab308'; // Stale - yellow
    return '#ef4444'; // Very stale - red
  };

  return (
    <div className="header">
      <div>
        <div className="title">Ecommerce Performance Overview</div>
        <div className="real-time-status" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85em' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div 
              style={{
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: getStatusColor(),
                animation: isRefreshing ? 'pulse 1s infinite' : 'none'
              }}
            ></div>
            <span style={{ color: '#666' }}>
              {isRefreshing ? 'Updating...' : `Last updated: ${formatLastUpdated(lastUpdated)}`}
            </span>
          </div>
          <button 
            onClick={refreshData} 
            disabled={isRefreshing}
            className="btn secondary"
            style={{ 
              padding: '4px 8px', 
              fontSize: '0.8em',
              opacity: isRefreshing ? 0.6 : 1,
              cursor: isRefreshing ? 'not-allowed' : 'pointer'
            }}
          >
            {isRefreshing ? '↻' : '🔄'} Refresh
          </button>
        </div>
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
