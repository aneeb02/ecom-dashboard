import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { nameToCode } from "../lib/stateLookup";
import { useMemo, useState } from "react";
import { formatCurrency } from "../lib/formatters";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function USChoropleth({ data }){
  const [hoveredState, setHoveredState] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  
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

  return (
    <div className="card" style={{height:500}}>
      <div className="kpi-title">
        <b>Ecommerce Revenue</b> by State - DEBUG MODE
        {hoveredState && (
          <div style={{fontSize: '0.9em', color: '#666', marginTop: '4px'}}>
            {hoveredState.name}: {formatCurrency(hoveredState.revenue)}
          </div>
        )}
      </div>
      
      {/* Debug info */}
      {debugInfo && (
        <div style={{fontSize: '0.7em', background: '#f5f5f5', padding: '10px', margin: '10px 0', maxHeight: '100px', overflow: 'auto'}}>
          <strong>Debug Info (First State):</strong><br/>
          Properties: {JSON.stringify(debugInfo, null, 2)}
        </div>
      )}
      
      <ComposableMap projection="geoAlbersUsa" width={600} height={280}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo, index) => {
              // Log first geography's properties for debugging
              if (index === 0 && !debugInfo) {
                console.log('Geography properties:', geo.properties);
                setDebugInfo(geo.properties);
              }
              
              // Try different possible property names
              const code = geo.properties?.postal || geo.properties?.STUSPS || geo.properties?.STATE || geo.id;
              const stateName = geo.properties?.NAME || geo.properties?.name;
              
              let revenue = lookup.revenue.get(code) || 0;
              
              // If no revenue found by code, try by name
              if (revenue === 0 && stateName) {
                const stateData = data.find(d => d.state === stateName);
                revenue = stateData?.revenue || 0;
              }
              
              // Enhanced color calculation
              let fillColor;
              if (revenue === 0) {
                fillColor = "#f0f0f0";
              } else {
                const intensity = ((revenue - min) / (max - min)) * 0.8 + 0.2;
                fillColor = `hsl(210, ${60 + intensity * 40}%, ${80 - intensity * 30}%)`;
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
                      name: stateName || code || 'Unknown',
                      code: code || 'N/A',
                      revenue: revenue,
                      properties: geo.properties // Include for debugging
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
      
      {/* Debug section */}
      <div style={{marginTop: '10px', fontSize: '0.8em', color: '#666'}}>
        <strong>Debug Info:</strong><br/>
        Data states: {data.length} | 
        Sample states: {data.slice(0, 3).map(d => `${d.state}:$${d.revenue}`).join(', ')}
      </div>
      
      <div style={{marginTop: '10px', fontSize: '0.8em', color: '#666'}}>
        Showing data for {data.length} states • Real-time data syncing every 30 seconds
      </div>
    </div>
  );
}
