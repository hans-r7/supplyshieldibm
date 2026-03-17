import { weatherEvents } from "@/data/weatherEvents";
import { Cloud, Thermometer, Users, Clock } from "lucide-react";

const severityColor = (s: number) =>
  s > 7 ? "text-risk-critical bg-risk-critical/10" : s >= 4 ? "text-risk-medium bg-risk-medium/10" : "text-risk-low bg-risk-low/10";

const statusColor = (s: string) =>
  s === "Active" ? "text-risk-critical bg-risk-critical/10" : s === "Monitoring" ? "text-risk-medium bg-risk-medium/10" : "text-risk-low bg-risk-low/10";

const activeCount = weatherEvents.filter((e) => e.status !== "Resolved").length;
const avgSeverity = (weatherEvents.reduce((a, e) => a + e.severity, 0) / weatherEvents.length).toFixed(1);
const suppliersAffected = new Set(weatherEvents.filter((e) => e.status !== "Resolved").map((e) => e.supplier)).size;
const maxDelay = Math.max(...weatherEvents.map((e) => e.delayDays));

const metrics = [
  { label: "Active Events", value: activeCount, icon: Cloud, color: "text-primary" },
  { label: "Avg Severity", value: avgSeverity, icon: Thermometer, color: "text-risk-medium" },
  { label: "Suppliers Affected", value: suppliersAffected, icon: Users, color: "text-risk-critical" },
  { label: "Max Delay Days", value: `${maxDelay}d`, icon: Clock, color: "text-foreground" },
];

const WeatherRisks = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1">Weather Risks</h2>
        <p className="text-sm text-muted-foreground">Climate and weather disruption monitoring</p>
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
              <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Delay</th>
              <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {weatherEvents.map((e, i) => (
              <tr
                key={e.id}
                className={`border-b border-border/50 ${i % 2 === 0 ? "bg-card" : "bg-surface-overlay/30"}`}
              >
                <td className="px-4 py-3 text-foreground font-medium">{e.event}</td>
                <td className="px-4 py-3 text-muted-foreground">{e.country}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono-data font-semibold ${severityColor(e.severity)}`}>
                    {e.severity}/10
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.supplier}</td>
                <td className="px-4 py-3 font-mono-data text-muted-foreground">{e.delayDays}d</td>
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

export default WeatherRisks;
