export interface GeopoliticalEvent {
  id: string;
  event: string;
  country: string;
  severity: number;
  supplier: string;
  description: string;
  status: "Active" | "Monitoring" | "Resolved";
}

export const geopoliticalEvents: GeopoliticalEvent[] = [
  { id: "gp-1", event: "Export Ban", country: "China", severity: 9, supplier: "SMIC China", description: "Restricts advanced chip exports to US firms", status: "Active" },
  { id: "gp-2", event: "Trade Sanctions", country: "Taiwan", severity: 7, supplier: "TSMC Taiwan", description: "US-China tensions impacting fab operations", status: "Monitoring" },
  { id: "gp-3", event: "Port Strike", country: "Netherlands", severity: 5, supplier: "ASML Netherlands", description: "Rotterdam port workers strike delays shipments", status: "Active" },
  { id: "gp-4", event: "Civil Unrest", country: "South Korea", severity: 4, supplier: "Samsung Korea", description: "Protests near Pyeongtaek factory", status: "Monitoring" },
  { id: "gp-5", event: "Earthquake", country: "Japan", severity: 6, supplier: "Renesas Japan", description: "Disrupts Naka factory production", status: "Resolved" },
  { id: "gp-6", event: "Export Restriction", country: "Netherlands", severity: 5, supplier: "ASML Netherlands", description: "ASML lithography export controls tightened", status: "Active" },
];

export const injectedEvent: GeopoliticalEvent = {
  id: "gp-inject",
  event: "Taiwan Strait Blockade",
  country: "Taiwan",
  severity: 10,
  supplier: "TSMC Taiwan",
  description: "Critical shipping lane closure imminent",
  status: "Active",
};
