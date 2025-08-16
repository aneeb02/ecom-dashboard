import Header from "./components/Header";
import KpiGrid from "./components/KpiGrid";
import Filters from "./components/Filters";
import LineDualAxis from "./components/LineDualAxis";
import ProductBars from "./components/ProductBars";
import ChannelTable from "./components/ChannelTable";
import USChoropleth from "./components/USChoropleth";
import DeviceBars from "./components/DeviceBars";
import useDashboardData from "./hooks/useDashboardData";

export default function App(){
  const { data, loading, error, ui, derived, lastUpdated, isRefreshing, refreshData } = useDashboardData();

  if(loading) return <div className="container">Loading…</div>;
  if(error) return <div className="container">Error: {String(error)}</div>;
  if(!data) return null;

  return (
    <div className="container grid">
      <Header 
        range={ui.range} 
        setRange={ui.setRange}
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        refreshData={refreshData}
      />
      <KpiGrid kpis={data.kpis}/>
      <Filters
        kpi1={ui.kpi1} setKpi1={ui.setKpi1}
        kpi2={ui.kpi2} setKpi2={ui.setKpi2}
        breakdown={ui.breakdown} setBreakdown={ui.setBreakdown}
      />
      <div className="grid section-grid">
        <LineDualAxis data={derived.timeSeries}/>
        <ProductBars data={data.productPerformance}/>
      </div>
      <div className="grid bottom-grid">
        <ChannelTable data={data.marketingChannels}/>
        <USChoropleth data={data.statePerformance}/>
        <DeviceBars data={data.devicePerformance}/>
      </div>
    </div>
  );
}
