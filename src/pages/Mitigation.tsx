import { useState } from "react";
import { ChevronRight, CheckCircle } from "lucide-react";

interface MitigationCard {
  id: string;
  supplier: string;
  severity: "Critical" | "High" | "Medium";
  reason: string;
  actions: string[];
}

const mitigationData: MitigationCard[] = [
  { id: "m-1", supplier: "TSMC Taiwan", severity: "Critical", reason: "Taiwan Strait tensions threatening primary fab operations", actions: ["Switch to Samsung Korea for logic orders", "Increase buffer stock by 40%", "Accelerate Q4 orders by 6 weeks"] },
  { id: "m-2", supplier: "SMIC China", severity: "High", reason: "Export ban restricts advanced node access", actions: ["Qualify TSMC Arizona as alternative", "File for export license exemption"] },
  { id: "m-3", supplier: "Unisem Malaysia", severity: "High", reason: "Monsoon flooding disrupting assembly lines", actions: ["Reroute to ASE Malaysia facility", "Increase safety stock by 25%"] },
  { id: "m-4", supplier: "Samsung Korea", severity: "Medium", reason: "Port delays affecting DRAM shipments", actions: ["Air freight critical components", "Adjust reorder schedule"] },
  { id: "m-5", supplier: "ASML Netherlands", severity: "Medium", reason: "Export controls on EUV tools", actions: ["Expedite current tool delivery", "Explore used equipment market"] },
];

const badgeClass = (severity: string, resolved: boolean) => {
  if (resolved) return "text-risk-low bg-risk-low/10";
  if (severity === "Critical") return "text-risk-critical bg-risk-critical/10";
  if (severity === "High") return "text-risk-medium bg-risk-medium/10";
  return "text-primary bg-primary/10";
};

const Mitigation = () => {
  const [resolved, setResolved] = useState<Set<string>>(new Set());

  const toggle = (id: string) => setResolved((prev) => new Set(prev).add(id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1">Mitigation</h2>
        <p className="text-sm text-muted-foreground">AI-recommended mitigation actions</p>
      </div>

      <div className="space-y-4">
        {mitigationData.map((card) => {
          const isResolved = resolved.has(card.id);
          return (
            <div
              key={card.id}
              className={`card-glow rounded bg-card p-5 cascade-transition ${isResolved ? "opacity-40" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-foreground font-semibold">{card.supplier}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${badgeClass(card.severity, isResolved)}`}>
                  {isResolved ? "Resolved" : card.severity}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{card.reason}</p>

              <ul className="space-y-2 mb-4">
                {card.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-end">
                <button
                  onClick={() => toggle(card.id)}
                  disabled={isResolved}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded cascade-transition ${
                    isResolved
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-risk-low hover:bg-risk-low/10"
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  {isResolved ? "Resolved" : "Mark Resolved"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Mitigation;
