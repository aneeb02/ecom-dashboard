import { useEffect, useMemo, useState } from "react";
import { clampSeriesByDate } from "../lib/formatters";

const API = '';

async function getJSON(path) {
  const res = await fetch(`${API}${path}`, { headers: { Accept: 'application/json' } });
  const ct = res.headers.get('content-type') || '';
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0,120)}`);
  if (!ct.includes('application/json')) throw new Error(`Expected JSON, got ${ct}. First: ${text.slice(0,60)}`);
  return JSON.parse(text);
}

export default function useDashboardData(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // UI state
  const [range, setRange] = useState({ start: new Date("2020-02-01"), end: new Date("2020-08-15") });
  const [kpi1, setKpi1] = useState("Ecommerce Revenue");
  const [kpi2, setKpi2] = useState("Ecommerce Conversion Rate");
  const [breakdown, setBreakdown] = useState("Weekly");

  const fetchData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setIsRefreshing(true);
      
      const [kpis, overTime, products, channels, states, devices] = await Promise.all([
        getJSON('/api/kpis'),
        getJSON('/api/revenue-over-time?start=2020-02-01&end=2020-08-15&breakdown=weekly'),
        getJSON('/api/products'),
        getJSON('/api/channels'),
        getJSON('/api/states'),
        getJSON('/api/devices'),
      ]);
      
      setData({
        kpis: kpis.kpis,
        revenueOverTime: overTime.revenueOverTime,
        productPerformance: products.productPerformance,
        marketingChannels: channels.marketingChannels,
        statePerformance: states.statePerformance,
        devicePerformance: devices.devicePerformance,
      });
      
      setLastUpdated(new Date());
      setError(null);
    } catch (e) { 
      console.error('Data fetch error:', e);
      setError(e); 
    } finally { 
      setLoading(false);
      if (isManualRefresh) setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !isRefreshing) {
        fetchData();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loading, isRefreshing]);

  // Manual refresh function
  const refreshData = () => {
    fetchData(true);
  };

  const filteredTime = useMemo(()=>{
    if(!data) return [];
    return clampSeriesByDate(data.revenueOverTime, range.start, range.end);
  }, [data, range]);

  return {
    data, loading, error, lastUpdated, isRefreshing, refreshData,
    ui: { range, setRange, kpi1, setKpi1, kpi2, setKpi2, breakdown, setBreakdown },
    derived: { timeSeries: filteredTime }
  };
}
