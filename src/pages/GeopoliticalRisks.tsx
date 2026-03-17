import { useState } from "react";
import { geopoliticalEvents, injectedEvent, GeopoliticalEvent } from "@/data/geopoliticalEvents";
import { useSuppliers } from "@/context/SupplierContext";
import { AlertTriangle, Globe, Users, Zap, TrendingUp } from "lucide-react";

const severityColor = (s: number) =>
  s > 7 ? "text-risk-critical bg-risk-critical/10" : s >= 4 ? "text-risk-medium bg-risk-medium/10" : "text-risk-low bg-risk-low/10";

const statusColor = (s: string) =>
  s === "Active" ? "text-risk-critical bg-risk-critical/10" : s === "Monitoring" ? "text-risk-medium bg-risk-medium/10" : "text-risk-low bg-risk-low/10";

const GeopoliticalRisks = () => {
  const { updateSupplierRisk } = useSuppliers();
  const [events, setEvents] = useState<GeopoliticalEvent[]>(geopoliticalEvents);
  const [injected, setInjected] = useState(false);

  const handleInject = () => {
    if (injected) return;
    setInjected(true);
    setEvents((prev) => [injectedEvent, ...prev]);
    updateSupplierRisk("tsmc-tw", 10);
  };

  const activeCount = events.filter((e) => e.status !== "Resolved").length;
  const avgSeverity = (events.reduce((a, e) => a + e.severity, 0) / events.length).toFixed(1);
  const suppliersAffected = new Set(events.filter((e) => e.status !== "Resolved").map((e) => e.supplier)).size;
  const maxSeverity = Math.max(...events.map((e) => e.severity));

  const metrics = [
    { label: "Active Events", value: activeCount, icon: AlertTriangle, color: "text-primary" },
    { label: "Avg Severity", value: avgSeverity, icon: TrendingUp, color: "text-risk-medium" },
    { label: "Suppliers Affected", value: suppliersAffected, icon: Users, color: "text-risk-critical" },
    { label: "Max Severity", value: `${maxSeverity}/10`, icon: Globe, color: "text-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1">Geopolitical Risks</h2>
          <p className="text-sm text-muted-foreground">Geopolitical event tracking and injection</p>
        </div>
        <button
          onClick={handleInject}
          disabled={injected}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold cascade-transition ${
            injected
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-destructive text-destructive-foreground hover:brightness-110 active:scale-95"
          }`}
        >
          <Zap className="h-4 w-4" />
          {injected ? "Event Injected" : "Inject Event"}
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card-glow rounded bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className={`h-4 w-4 ${m.color}`} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</span>
            </div>
            <p className={`font-mono-data text-2xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-glow rounded bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Event</th>
              <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Country</th>
              <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Severity</th>
              <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Supplier</th>
              <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Description</th>
              <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr
                key={e.id}
                className={`border-b border-border/50 cascade-transition ${
                  e.id === "gp-inject" ? "animate-risk-pulse" : ""
                } ${i % 2 === 0 ? "bg-card" : "bg-surface-overlay/30"}`}
              >
                <td className="px-4 py-3 text-foreground font-medium">{e.event}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.country}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono-data font-semibold ${severityColor(e.severity)}`}>
                    {e.severity}/10
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.supplier}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs max-w-[240px] truncate">{e.description}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusColor(e.status)}`}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeopoliticalRisks;
