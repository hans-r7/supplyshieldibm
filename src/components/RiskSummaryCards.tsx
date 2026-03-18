import { useSuppliers } from "@/context/SupplierContext";
import CountUpModule from "react-countup";
import { cn } from "@/lib/utils";

// Vite occasionally misresolves CommonJS default exports as module namespace objects. Extract the component safely.
const CountUp = (CountUpModule as any).default || CountUpModule;

const StatCard = ({
  label,
  value,
  colorClass,
  pulse = false,
}: {
  label: string;
  value: number;
  colorClass: string;
  pulse?: boolean;
}) => (
  <div className="relative group">
    {pulse && value > 0 && (
      <div className="absolute -inset-0.5 rounded-lg bg-risk-critical opacity-40 blur-md animate-risk-pulse" />
    )}
    <div className={cn("relative card-glow rounded-lg bg-card p-5 flex flex-col min-w-[140px] h-full transition-all duration-300", pulse && value > 0 && "border-risk-critical/50")}>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <div className="mt-auto">
        <CountUp
          start={0}
          end={value}
          duration={2.5}
          separator=","
          preserveValue
          className={cn("font-mono-data text-4xl font-bold tracking-tight", colorClass)}
        />
      </div>
    </div>
  </div>
);

const RiskSummaryCards = () => {
  const { suppliers } = useSuppliers();

  const high = suppliers.filter((s) => s.riskScore >= 8).length;
  const medium = suppliers.filter((s) => s.riskScore >= 5 && s.riskScore < 8).length;
  const low = suppliers.filter((s) => s.riskScore < 5).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <StatCard label="Total Suppliers" value={suppliers.length} colorClass="text-foreground" />
      <StatCard label="High Risk" value={high} colorClass="text-risk-critical" pulse={true} />
      <StatCard label="Medium Risk" value={medium} colorClass="text-risk-medium" />
      <StatCard label="Low Risk" value={low} colorClass="text-risk-low" />
    </div>
  );
};

export default RiskSummaryCards;
