import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { nameToCode } from "../lib/stateLookup";
import { useMemo } from "react";
import { formatCurrency } from "../lib/formatters";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function USChoropleth({ data }){
  const lookup = useMemo(()=>{
    const m = new Map();
    data.forEach(d=> m.set(nameToCode[d.state], d.revenue));
    return m;
  }, [data]);

  const max = Math.max(...data.map(d=> d.revenue));

  return (
    <div className="card" style={{height:300}}>
      <div className="kpi-title"><b>Ecommerce Revenue</b> by State</div>
      <ComposableMap projection="geoAlbersUsa" width={600} height={260}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const code = geo.properties?.postal;
              const val = lookup.get(code) || 0;
              const intensity = val ? Math.round((val/max)*180)+40 : 240; // darker for higher
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={`hsl(215, 60%, ${intensity/3}%)`}
                  stroke="#fff"
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill:"#1f4b99" },
                    pressed:{ outline: "none" }
                  }}
                  onMouseEnter={(e)=> {
                    const el = e.target;
                    el.setAttribute("data-tip", `${code}: ${formatCurrency(val)}`);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="legend">Darker = higher revenue</div>
    </div>
  );
}
