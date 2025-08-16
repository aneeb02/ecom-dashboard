import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { nameToCode } from "../lib/stateLookup";
import { useMemo, useState } from "react";
import { formatCurrency } from "../lib/formatters";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function USChoropleth({ data }){
  const [hoveredState, setHoveredState] = useState(null);
  
  const lookup = useMemo(()=>{
    const m = new Map();
    const stateNames = new Map();
    data.forEach(d=> {
      const code = nameToCode[d.state];
      if (code) {
        m.set(code, d.revenue);
        stateNames.set(code, d.state);
      }
    });
    return { revenue: m, names: stateNames };
  }, [data]);

  const max = Math.max(...data.map(d=> d.revenue));
  const min = Math.min(...data.map(d=> d.revenue));
  
  // Find the state name for display
  const getStateName = (code) => {
    return lookup.names.get(code) || 
           Object.keys(nameToCode).find(name => nameToCode[name] === code) || 
           code;
  };

  return (
    <div className="card" style={{height:350}}>
      <div className="kpi-title">
        <b>Ecommerce Revenue</b> by State
        {hoveredState && (
          <div style={{fontSize: '0.9em', color: '#666', marginTop: '4px'}}>
            {hoveredState.name}: {formatCurrency(hoveredState.revenue)}
          </div>
        )}
      </div>
      <ComposableMap projection="geoAlbersUsa" width={600} height={280}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              // US Atlas TopoJSON uses specific property names
              // The ID field contains FIPS codes, and properties contain state info
              const fipsId = geo.id;
              const stateName = geo.properties?.name;
              
              // Map FIPS codes to state codes for the first few states to test
              const fipsToState = {
                '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO',
                '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI',
                '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', '20': 'KS', '21': 'KY',
                '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN',
                '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
                '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH',
                '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', '45': 'SC', '46': 'SD',
                '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA',
                '54': 'WV', '55': 'WI', '56': 'WY'
              };
              
              const stateCode = fipsToState[fipsId];
              let revenue = lookup.revenue.get(stateCode) || 0;
              
              // If no revenue found by code, try by name
              if (revenue === 0 && stateName) {
                const stateData = data.find(d => d.state.toLowerCase() === stateName.toLowerCase());
                revenue = stateData?.revenue || 0;
              }
              
              const displayName = lookup.names.get(stateCode) || stateName || stateCode || 'Unknown';
              
              // Enhanced color calculation to match target design
              let fillColor;
              if (revenue === 0) {
                // No data - very light gray
                fillColor = "#f8f9fa";
              } else {
                // Revenue data available - blue gradient matching target
                const intensity = (revenue - min) / (max - min);
                
                if (intensity < 0.3) {
                  // Light blue for low values
                  fillColor = `hsl(200, 70%, ${85 - intensity * 15}%)`;
                } else if (intensity < 0.7) {
                  // Medium blue for medium values  
                  fillColor = `hsl(205, 80%, ${70 - intensity * 20}%)`;
                } else {
                  // Dark blue for high values
                  fillColor = `hsl(210, 90%, ${50 - intensity * 20}%)`;
                }
              }
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: { 
                      outline: "none",
                      transition: "all 0.2s ease-in-out"
                    },
                    hover: { 
                      outline: "none", 
                      fill: revenue > 0 ? "#1f4b99" : "#ccc",
                      strokeWidth: 1,
                      cursor: "pointer"
                    },
                    pressed: { outline: "none" }
                  }}
                  onMouseEnter={() => {
                    setHoveredState({
                      name: displayName,
                      code: stateCode,
                      revenue: revenue
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredState(null);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      
      {/* Legend - matching target design */}
      <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginTop: '8px', fontSize: '12px', color: '#6b7280'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <div style={{width: '12px', height: '12px', backgroundColor: '#f8f9fa', border: '1px solid #e5e7eb', borderRadius: '2px'}}></div>
            <span>No</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <div style={{width: '12px', height: '12px', backgroundColor: 'hsl(200, 70%, 75%)', borderRadius: '2px'}}></div>
            <span>Low</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <div style={{width: '12px', height: '12px', backgroundColor: 'hsl(210, 90%, 40%)', borderRadius: '2px'}}></div>
            <span>High</span>
          </div>
          <div style={{marginLeft: '16px', color: '#6b7280'}}>
            Range: {formatCurrency(min)} - {formatCurrency(max)}
          </div>
        </div>
      </div>
    </div>
  );
}
