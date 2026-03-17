import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { useSuppliers } from "@/context/SupplierContext";
import { getRiskColor } from "@/data/suppliers";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const SupplierMap = () => {
  const { suppliers } = useSuppliers();
  const [tooltip, setTooltip] = useState<{
    name: string;
    country: string;
    component: string;
    riskScore: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="relative w-full card-glow rounded bg-card overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130, center: [20, 20] }}
        className="w-full"
        style={{ aspectRatio: "2.2 / 1" }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="hsl(222 30% 18%)"
                  stroke="hsl(222 30% 12%)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "hsl(222 30% 22%)", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {suppliers.map((supplier) => {
            const color = `hsl(${getRiskColor(supplier.riskScore)})`;
            return (
              <Marker
                key={supplier.id}
                coordinates={[supplier.coordinates[1], supplier.coordinates[0]]}
                onMouseEnter={(e) => {
                  const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                  if (rect) {
                    setTooltip({
                      name: supplier.name,
                      country: supplier.country,
                      component: supplier.component,
                      riskScore: supplier.riskScore,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Pulse ring */}
                <circle r={8} fill={color} opacity={0.25}>
                  <animate
                    attributeName="r"
                    from="6"
                    to="14"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.4"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Core dot */}
                <circle
                  r={4}
                  fill={color}
                  stroke="hsl(222 47% 4%)"
                  strokeWidth={1.5}
                  className="cursor-pointer"
                />
                {/* Score label */}
                <text
                  textAnchor="middle"
                  y={-10}
                  className="fill-foreground text-[8px] font-mono-data pointer-events-none select-none"
                >
                  {supplier.riskScore}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <div className="bg-surface-overlay border border-border rounded px-3 py-2 shadow-lg min-w-[180px]">
            <p className="text-sm font-semibold text-foreground">{tooltip.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{tooltip.country}</p>
            <p className="text-xs text-muted-foreground">{tooltip.component}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-muted-foreground">Risk Score</span>
              <span
                className="font-mono-data text-sm font-bold"
                style={{ color: `hsl(${getRiskColor(tooltip.riskScore)})` }}
              >
                {tooltip.riskScore}/10
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierMap;
