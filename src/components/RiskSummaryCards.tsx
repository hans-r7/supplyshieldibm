import { useSuppliers } from "@/context/SupplierContext";

const StatCard = ({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) => (
  <div className="card-glow rounded bg-card p-4 flex-1 min-w-[140px]">
    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
    <p className={`font-mono-data text-2xl font-bold ${colorClass}`}>{value}</p>
  </div>
);

const RiskSummaryCards = () => {
  const { suppliers } = useSuppliers();

  const high = suppliers.filter((s) => s.riskScore >= 8).length;
  const medium = suppliers.filter((s) => s.riskScore >= 5 && s.riskScore < 8).length;
  const low = suppliers.filter((s) => s.riskScore < 5).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Suppliers" value={suppliers.length} colorClass="text-foreground" />
      <StatCard label="High Risk" value={high} colorClass="text-risk-critical" />
      <StatCard label="Medium Risk" value={medium} colorClass="text-risk-medium" />
      <StatCard label="Low Risk" value={low} colorClass="text-risk-low" />
    </div>
  );
};

export default RiskSummaryCards;
