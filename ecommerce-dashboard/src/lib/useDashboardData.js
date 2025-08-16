import { useEffect, useMemo, useState } from "react";
import { clampSeriesByDate } from "../lib/formatters";

export default function useDashboardData(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [range, setRange] = useState({ start: new Date("2020-02-01"), end: new Date("2020-08-15") });
  const [kpi1, setKpi1] = useState("Ecommerce Revenue");
  const [kpi2, setKpi2] = useState("Ecommerce Conversion Rate");
  const [breakdown, setBreakdown] = useState("Weekly");

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await fetch("/dashboard.json");
        const j = await res.json();
        setData(j);
      }catch(e){ setError(e);}
      finally{ setLoading(false); }
    })();
  },[]);

  const filteredTime = useMemo(()=>{
    if(!data) return [];
    return clampSeriesByDate(data.revenueOverTime, range.start, range.end);
  }, [data, range]);

  return {
    data, loading, error,
    ui: { range, setRange, kpi1, setKpi1, kpi2, setKpi2, breakdown, setBreakdown },
    derived: { timeSeries: filteredTime }
  };
}
