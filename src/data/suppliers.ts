export interface Supplier {
  id: string;
  name: string;
  country: string;
  component: string;
  coordinates: [number, number]; // [lat, lng]
  riskScore: number;
  escalationStatus?: "pending" | "approved" | "dismissed";
}

export const suppliers: Supplier[] = [
  { id: "tsmc-tw", name: "TSMC Taiwan", country: "Taiwan", component: "Advanced Logic (3nm/5nm)", coordinates: [25.0, 121.5], riskScore: 8 },
  { id: "samsung-kr", name: "Samsung Korea", country: "South Korea", component: "Memory (DRAM/NAND)", coordinates: [37.5, 127.0], riskScore: 5 },
  { id: "renesas-jp", name: "Renesas Japan", country: "Japan", component: "Automotive MCUs", coordinates: [35.6, 139.7], riskScore: 3 },
  { id: "asml-nl", name: "ASML Netherlands", country: "Netherlands", component: "EUV Lithography", coordinates: [52.3, 4.9], riskScore: 2 },
  { id: "tsmc-az", name: "TSMC Arizona", country: "USA", component: "Advanced Logic (4nm)", coordinates: [33.4, -112.0], riskScore: 4 },
  { id: "infineon-de", name: "Infineon Germany", country: "Germany", component: "Power Semiconductors", coordinates: [51.1, 10.4], riskScore: 3 },
  { id: "smic-cn", name: "SMIC China", country: "China", component: "Mature Node (28nm+)", coordinates: [31.2, 121.4], riskScore: 9 },
  { id: "unisem-my", name: "Unisem Malaysia", country: "Malaysia", component: "OSAT Packaging", coordinates: [3.1, 101.6], riskScore: 6 },
];

export type RiskLevel = "critical" | "high" | "medium" | "low";

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 8) return "critical";
  if (score >= 5) return "medium";
  return "low";
}

export function getRiskColor(score: number): string {
  if (score >= 8) return "var(--risk-critical)";
  if (score >= 5) return "var(--risk-medium)";
  return "var(--risk-low)";
}
