import { useState, useMemo, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  ZoomableGroup,
} from "react-simple-maps";
import { useSuppliers } from "@/context/SupplierContext";
import { getRiskColor } from "@/data/suppliers";
import {
  chokepoints,
  supplyRoutes,
  modeConfig,
  TransportMode,
} from "@/data/supplyRoutes";
import {
  crisisStats,
  crisisAlerts,
  crisisLogEntries,
  crisisSupplierOverrides,
} from "@/data/crisisMode";
import { Ship, Plane, Truck, AlertTriangle, Play, X, Activity, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const modeIcons: Record<TransportMode, React.ReactNode> = {
  sea: <Ship className="h-3.5 w-3.5" />,
  air: <Plane className="h-3.5 w-3.5" />,
  land: <Truck className="h-3.5 w-3.5" />,
};

const agentBadge: Record<string, string> = {
  "Risk Scorer": "text-primary bg-primary/10",
  "Supplier Mapper": "text-purple-400 bg-purple-500/10",
  "Mitigation Advisor": "text-risk-low bg-risk-low/10",
  "Escalation Agent": "text-risk-critical bg-risk-critical/10",
};

// Helper: compute a curved midpoint for arc lines
function arcMidpoint(
  from: [number, number],
  to: [number, number]
): [number, number] {
  const midLng = (from[0] + to[0]) / 2;
  const midLat = (from[1] + to[1]) / 2;
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offset = dist * 0.15;
  // perpendicular offset
  const nx = -dy / dist;
  const ny = dx / dist;
  return [midLng + nx * offset, midLat + ny * offset];
}

interface TooltipData {
  type: "supplier" | "chokepoint";
  name: string;
  riskScore: number;
  description: string;
  recommendation: string;
  extra?: Record<string, string>;
  x: number;
  y: number;
}

const SupplierMap = () => {
  const { suppliers } = useSuppliers();
  const [activeModes, setActiveModes] = useState<Set<TransportMode>>(
    new Set(["sea", "air", "land"])
  );
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [crisisMode, setCrisisMode] = useState(false);
  const [position, setPosition] = useState({ coordinates: [30, 20] as [number, number], zoom: 1 });

  const toggleMode = useCallback((mode: TransportMode) => {
    setActiveModes((prev) => {
      const next = new Set(prev);
      if (next.has(mode)) {
        if (next.size > 1) next.delete(mode);
      } else {
        next.add(mode);
      }
      return next;
    });
  }, []);

  const filteredRoutes = useMemo(
    () => supplyRoutes.filter((r) => activeModes.has(r.mode)),
    [activeModes]
  );

  const filteredChokepoints = useMemo(
    () =>
      chokepoints.filter((cp) => cp.modes.some((m) => activeModes.has(m))),
    [activeModes]
  );

  const getSupplierScore = useCallback(
    (id: string, original: number) =>
      crisisMode ? crisisSupplierOverrides[id] ?? original : original,
    [crisisMode]
  );

  const handleMarkerHover = useCallback(
    (
      e: React.MouseEvent,
      data: Omit<TooltipData, "x" | "y">
    ) => {
      const rect = (e.target as SVGElement)
        .closest("svg")
        ?.getBoundingClientRect();
      if (rect) {
        setTooltip({
          ...data,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    []
  );

  const getRouteColor = (route: typeof supplyRoutes[0]) => {
    if (crisisMode) return "hsl(var(--risk-critical))";
    const score = route.riskScore;
    if (score >= 8) return "hsl(var(--risk-critical))";
    if (score >= 5) return "hsl(var(--risk-medium))";
    return `hsl(var(--risk-low))`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Crisis Mode Banner */}
      {crisisMode && (
        <div className="relative overflow-hidden rounded-lg border border-risk-high/40 bg-risk-high/10 px-4 py-3 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-risk-high/5 to-risk-critical/5" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-risk-high animate-risk-pulse" />
              <div>
                <p className="text-sm font-bold text-risk-high tracking-wide uppercase">
                  ⚠ 2021 Crisis Mode — Historical Replay
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Simulating the global semiconductor shortage that impacted {crisisStats.peakShortage}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCrisisMode(false)}
              className="p-1.5 rounded hover:bg-risk-high/20 text-risk-high transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full rounded-lg overflow-hidden border border-border bg-card">
        {/* Controls overlay */}
        <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
          {/* Mode toggles */}
          <div className="flex gap-1 bg-background/80 backdrop-blur-sm rounded-lg p-1 border border-border">
            {(["sea", "air", "land"] as TransportMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => toggleMode(mode)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                  activeModes.has(mode)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {modeIcons[mode]}
                {modeConfig[mode].label}
              </button>
            ))}
          </div>

          {/* Crisis mode toggle */}
          {!crisisMode && (
            <button
              onClick={() => setCrisisMode(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-xs font-medium text-muted-foreground hover:text-risk-high hover:border-risk-high/40 transition-all"
            >
              <Play className="h-3 w-3" />
              2021 Crisis Replay
            </button>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-3 left-3 z-30 flex flex-col gap-1 bg-background/80 backdrop-blur-sm rounded-lg p-1 border border-border">
          <button
            onClick={() => setPosition((pos) => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 8) }))}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPosition((pos) => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 1) }))}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 z-30 bg-background/80 backdrop-blur-sm rounded-lg p-2.5 border border-border">
          <div className="flex flex-col gap-1.5 text-[10px]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-risk-critical" />
              <span className="text-muted-foreground">Critical (8-10)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-risk-medium" />
              <span className="text-muted-foreground">Medium (5-7)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-risk-low" />
              <span className="text-muted-foreground">Low (1-4)</span>
            </div>
            <div className="flex items-center gap-2 mt-1 pt-1 border-t border-border">
              <span className="h-0.5 w-4 bg-risk-critical rounded" />
              <span className="text-muted-foreground">Chokepoint</span>
            </div>
          </div>
        </div>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140, center: [30, 20] }}
          className="w-full"
          style={{ aspectRatio: "2.4 / 1" }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates: coordinates as [number, number], zoom })}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className={cn(
                      "stroke-border",
                      crisisMode ? "fill-destructive/8" : "fill-muted"
                    )}
                    strokeWidth={0.4}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", opacity: 0.85 },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Route arcs */}
            {filteredRoutes.map((route) => {
              const mid = arcMidpoint(route.from, route.to);
              const color = getRouteColor(route);
              return (
                <g key={route.id}>
                  <Line
                    from={route.from}
                    to={mid}
                    stroke={color}
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    strokeOpacity={crisisMode ? 0.7 : 0.45}
                    strokeDasharray={route.mode === "air" ? "4 4" : route.mode === "land" ? "2 2" : "6 4"}
                    className="animate-flow-line"
                  />
                  <Line
                    from={mid}
                    to={route.to}
                    stroke={color}
                    strokeWidth={1.2}
                    strokeLinecap="round"
                    strokeOpacity={crisisMode ? 0.7 : 0.45}
                    strokeDasharray={route.mode === "air" ? "4 4" : route.mode === "land" ? "2 2" : "6 4"}
                    className="animate-flow-line"
                  />
                </g>
              );
            })}

            {/* Chokepoint markers */}
            {filteredChokepoints.map((cp) => {
              const score = crisisMode ? Math.min(10, cp.riskScore + 2) : cp.riskScore;
              const color = `hsl(${getRiskColor(score)})`;
              return (
                <Marker
                  key={cp.id}
                  coordinates={cp.coordinates}
                  onMouseEnter={(e: any) =>
                    handleMarkerHover(e, {
                      type: "chokepoint",
                      name: cp.name,
                      riskScore: score,
                      description: cp.description,
                      recommendation: cp.recommendation,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Diamond shape for chokepoints */}
                  <rect
                    x={-5}
                    y={-5}
                    width={10}
                    height={10}
                    fill={color}
                    opacity={0.9}
                    transform="rotate(45)"
                    className="cursor-pointer"
                    stroke="hsl(var(--background))"
                    strokeWidth={1}
                  />
                  {crisisMode && (
                    <rect
                      x={-8}
                      y={-8}
                      width={16}
                      height={16}
                      fill={color}
                      transform="rotate(45)"
                      opacity={0.15}
                    >
                      <animate
                        attributeName="opacity"
                        from="0.3"
                        to="0"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  )}
                </Marker>
              );
            })}

            {/* Supplier pins */}
            {suppliers.map((supplier) => {
              const score = getSupplierScore(supplier.id, supplier.riskScore);
              const color = `hsl(${getRiskColor(score)})`;
              return (
                <Marker
                  key={supplier.id}
                  coordinates={[supplier.coordinates[1], supplier.coordinates[0]]}
                  onMouseEnter={(e: any) =>
                    handleMarkerHover(e, {
                      type: "supplier",
                      name: supplier.name,
                      riskScore: score,
                      description: `${supplier.component} — ${supplier.country}`,
                      recommendation:
                        score >= 8
                          ? "Activate contingency sourcing immediately. Escalate to procurement lead."
                          : score >= 5
                          ? "Monitor closely. Pre-qualify backup suppliers within 30 days."
                          : "Acceptable risk. Continue standard monitoring cadence.",
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                >
                  {/* Pulse ring */}
                  <circle r={8} fill={color} opacity={0.2}>
                    <animate
                      attributeName="r"
                      from="6"
                      to={crisisMode ? "18" : "14"}
                      dur={crisisMode ? "1.2s" : "2s"}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.4"
                      to="0"
                      dur={crisisMode ? "1.2s" : "2s"}
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Core dot */}
                  <circle
                    r={5}
                    fill={color}
                    stroke="hsl(var(--background))"
                    strokeWidth={1.5}
                    className="cursor-pointer"
                  />
                  {/* Score label */}
                  <text
                    textAnchor="middle"
                    y={-10}
                    className="fill-foreground text-[8px] font-mono-data pointer-events-none select-none"
                  >
                    {score}
                  </text>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Rich Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: Math.min(tooltip.x + 14, window.innerWidth - 320),
              top: tooltip.y - 10,
            }}
          >
            <div className="bg-popover border border-border rounded-lg px-4 py-3 shadow-xl min-w-[240px] max-w-[300px] animate-scale-in">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                    tooltip.type === "chokepoint"
                      ? "bg-risk-high/15 text-risk-high"
                      : "bg-primary/15 text-primary"
                  )}
                >
                  {tooltip.type === "chokepoint" ? "◆ Chokepoint" : "● Supplier"}
                </span>
                <span
                  className="font-mono-data text-sm font-bold ml-auto"
                  style={{ color: `hsl(${getRiskColor(tooltip.riskScore)})` }}
                >
                  {tooltip.riskScore}/10
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">{tooltip.name}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {tooltip.description}
              </p>
              <div className="mt-2.5 pt-2 border-t border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                  Agent Recommendation
                </p>
                <p className="text-xs text-foreground leading-relaxed">
                  {tooltip.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Crisis Mode Panels */}
      {crisisMode && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
          {/* Crisis Stats */}
          <div className="card-glow rounded-lg bg-card p-4 border border-risk-high/20">
            <h3 className="text-sm font-semibold text-risk-high mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {crisisStats.title}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Peak Impact", value: crisisStats.peakShortage },
                { label: "Auto Losses", value: crisisStats.autoLosses },
                { label: "Lead Times", value: crisisStats.leadTimeSpike },
                { label: "Price Impact", value: crisisStats.priceIncrease },
              ].map((stat) => (
                <div key={stat.label} className="bg-background/50 rounded p-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="font-mono-data text-xs font-bold text-foreground mt-0.5">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Crisis Alerts */}
          <div className="card-glow rounded-lg bg-card p-4 border border-risk-high/20">
            <h3 className="text-sm font-semibold text-foreground mb-3">Crisis Alerts</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {crisisAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-2 bg-background/50 rounded p-2"
                >
                  <span className="font-mono-data text-xs font-bold text-risk-critical mt-0.5 shrink-0">
                    {alert.severity}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {alert.event}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crisis Agent Log */}
          <div className="card-glow rounded-lg bg-card p-4 border border-risk-high/20">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Crisis Agent Log
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {crisisLogEntries.map((entry) => (
                <div key={entry.id} className="bg-background/50 rounded p-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono-data text-[10px] text-muted-foreground">
                      {entry.timestamp}
                    </span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase",
                        agentBadge[entry.agent]
                      )}
                    >
                      {entry.agent}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{entry.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {entry.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierMap;
