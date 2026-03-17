import { useState, useEffect, useRef } from "react";
import { Activity } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  agent: "Risk Scorer" | "Supplier Mapper" | "Mitigation Advisor" | "Escalation Agent";
  title: string;
  reasoning: string;
}

const agentColor: Record<string, string> = {
  "Risk Scorer": "bg-primary",
  "Supplier Mapper": "bg-purple-500",
  "Mitigation Advisor": "bg-risk-low",
  "Escalation Agent": "bg-risk-critical",
};

const agentBadge: Record<string, string> = {
  "Risk Scorer": "text-primary bg-primary/10",
  "Supplier Mapper": "text-purple-400 bg-purple-500/10",
  "Mitigation Advisor": "text-risk-low bg-risk-low/10",
  "Escalation Agent": "text-risk-critical bg-risk-critical/10",
};

// Static demo entries (not highlighted)
const logEntries: LogEntry[] = [
  { id: "l-01", timestamp: "14:32:01", agent: "Escalation Agent", title: "Critical alert sent to procurement team", reasoning: "TSMC Taiwan risk score reached 10, human review required" },
  { id: "l-02", timestamp: "14:31:45", agent: "Mitigation Advisor", title: "Generated 3 mitigation actions for TSMC Taiwan", reasoning: "Alternative suppliers ranked by capacity and lead time" },
  { id: "l-03", timestamp: "14:31:30", agent: "Risk Scorer", title: "TSMC Taiwan score updated 8→10", reasoning: "Taiwan Strait event severity 10 triggered threshold breach" },
  { id: "l-04", timestamp: "14:28:15", agent: "Supplier Mapper", title: "Supply chain impact mapped for Taiwan Strait event", reasoning: "3 tier-1 suppliers in affected corridor identified" },
  { id: "l-05", timestamp: "14:15:22", agent: "Risk Scorer", title: "SMIC China score updated 7→9", reasoning: "New export ban enforcement notice detected via OSINT feed" },
  { id: "l-06", timestamp: "14:10:08", agent: "Mitigation Advisor", title: "Generated 2 mitigation actions for Unisem Malaysia", reasoning: "Monsoon flooding severity upgraded, reroute options evaluated" },
  { id: "l-07", timestamp: "13:55:41", agent: "Supplier Mapper", title: "Mapped Renesas Japan to earthquake aftershock zone", reasoning: "Naka factory within 50km of epicenter, production impact likely" },
  { id: "l-08", timestamp: "13:42:19", agent: "Risk Scorer", title: "Samsung Korea score stable at 5", reasoning: "Port strike severity unchanged, monitoring continues" },
  { id: "l-09", timestamp: "13:30:00", agent: "Escalation Agent", title: "Monitoring threshold alert for SMIC China", reasoning: "Risk score approaching critical threshold, pre-alert issued" },
  { id: "l-10", timestamp: "13:15:33", agent: "Risk Scorer", title: "Routine scan completed for 8 suppliers", reasoning: "All supplier scores recalculated against latest signal feeds" },
];

const AgentLog = ({ entries = [] }) => {
  const [actionCount, setActionCount] = useState((entries.length || 0) + logEntries.length);
  const [highlighted, setHighlighted] = useState({});
  const prevEntriesRef = useRef(entries);

  // Highlight new entries for 3 seconds
  useEffect(() => {
    if (entries.length > prevEntriesRef.current.length) {
      const newIds = entries.slice(0, entries.length - prevEntriesRef.current.length).map(e => e.id);
      setHighlighted((prev) => {
        const next = { ...prev };
        newIds.forEach(id => { next[id] = true; });
        return next;
      });
      setTimeout(() => {
        setHighlighted((prev) => {
          const next = { ...prev };
          newIds.forEach(id => { delete next[id]; });
          return next;
        });
      }, 3000);
    }
    prevEntriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActionCount((c) => c + Math.floor(Math.random() * 2));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Merge static and dynamic entries
  const allEntries = [...(entries || []), ...logEntries];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground mb-1">Agent Log</h2>
          <p className="text-sm text-muted-foreground">Real-time AI agent decision stream</p>
        </div>
        <div className="card-glow rounded bg-card px-4 py-2 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Actions Today</span>
          <span className="font-mono-data text-lg font-bold text-foreground ml-1">{actionCount}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Spine */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-1">
          {allEntries.map((entry) => (
            <div
              key={entry.id}
              className={`relative flex items-start gap-4 py-3 transition-all duration-700 ${highlighted[entry.id] ? "ring-2 ring-primary/60 bg-primary/10 animate-pulse" : ""}`}
            >
              {/* Dot */}
              <div className={`absolute left-[-21px] top-[18px] h-2.5 w-2.5 rounded-full ${agentColor[entry.agent]} ring-2 ring-background`} />

              <div className="flex-1 card-glow rounded bg-card px-4 py-3">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono-data text-xs text-muted-foreground">{entry.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${agentBadge[entry.agent]}`}>
                    {entry.agent}
                  </span>
                </div>
                <p className="text-sm text-foreground font-medium">{entry.title || entry.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{entry.reasoning}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentLog;
