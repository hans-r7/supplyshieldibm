import SupplierMap from "@/components/SupplierMap";
import RiskSummaryCards from "@/components/RiskSummaryCards";
import SupplierMetricsTable from "@/components/SupplierMetricsTable";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Global supply chain risk overview</p>
      </div>
      <SupplierMap />
      <RiskSummaryCards />
      <SupplierMetricsTable />
    </div>
  );
};

export default Dashboard;
