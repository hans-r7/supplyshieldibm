export type TransportMode = "sea" | "air" | "land";

export interface Chokepoint {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  riskScore: number;
  modes: TransportMode[];
  description: string;
  recommendation: string;
}

export interface SupplyRoute {
  id: string;
  from: [number, number]; // [lng, lat]
  to: [number, number];
  mode: TransportMode;
  label: string;
  riskScore: number;
  chokepoints: string[]; // chokepoint ids along this route
}

export const chokepoints: Chokepoint[] = [
  {
    id: "cp-taiwan-strait",
    name: "Taiwan Strait",
    coordinates: [119.5, 24.0],
    riskScore: 9,
    modes: ["sea"],
    description: "Critical shipping lane for 60% of global chip shipments. Military tensions elevate disruption risk.",
    recommendation: "Diversify logistics via Japan Sea corridor; pre-position 90-day buffer stock.",
  },
  {
    id: "cp-malacca",
    name: "Strait of Malacca",
    coordinates: [101.5, 2.5],
    riskScore: 7,
    modes: ["sea"],
    description: "World's busiest shipping lane. Piracy and congestion pose recurring threats.",
    recommendation: "Use Lombok Strait bypass for non-time-critical cargo; add marine insurance.",
  },
  {
    id: "cp-suez",
    name: "Suez Canal",
    coordinates: [32.3, 30.5],
    riskScore: 6,
    modes: ["sea"],
    description: "Connects Asia-Europe trade. Blockage history (2021) demonstrated fragility.",
    recommendation: "Maintain Cape of Good Hope contingency routing; negotiate priority transit slots.",
  },
  {
    id: "cp-panama",
    name: "Panama Canal",
    coordinates: [-79.9, 9.1],
    riskScore: 5,
    modes: ["sea"],
    description: "Drought-affected capacity reductions impacting Asia-US East Coast routes.",
    recommendation: "Evaluate US West Coast + rail intermodal as alternative.",
  },
  {
    id: "cp-hormuz",
    name: "Strait of Hormuz",
    coordinates: [56.3, 26.6],
    riskScore: 8,
    modes: ["sea"],
    description: "Oil supply chokepoint with geopolitical tensions affecting nearby shipping.",
    recommendation: "Avoid routing semiconductor shipments through Persian Gulf; use air freight for critical parts.",
  },
  {
    id: "cp-incheon-air",
    name: "Incheon Air Hub",
    coordinates: [126.5, 37.5],
    riskScore: 3,
    modes: ["air"],
    description: "Major air cargo hub for Korean semiconductor exports.",
    recommendation: "Maintain dual-hub strategy with Narita as backup.",
  },
  {
    id: "cp-schiphol",
    name: "Schiphol Air Hub",
    coordinates: [4.8, 52.3],
    riskScore: 2,
    modes: ["air"],
    description: "Primary air logistics hub for ASML lithography equipment.",
    recommendation: "Current risk acceptable. Monitor EU aviation regulation changes.",
  },
  {
    id: "cp-silk-road",
    name: "China-Europe Rail Corridor",
    coordinates: [68.0, 45.0],
    riskScore: 6,
    modes: ["land"],
    description: "Belt & Road rail network. Sanctions and political instability create variable transit times.",
    recommendation: "Use for non-critical bulk shipments only; avoid sanctioned corridor segments.",
  },
  {
    id: "cp-us-mexico",
    name: "US-Mexico Border",
    coordinates: [-106.0, 31.8],
    riskScore: 4,
    modes: ["land"],
    description: "Nearshoring corridor for semiconductor packaging and assembly.",
    recommendation: "Leverage USMCA provisions; diversify border crossing points.",
  },
];

export const supplyRoutes: SupplyRoute[] = [
  // Sea routes
  {
    id: "sr-tsmc-us",
    from: [121.5, 25.0],
    to: [-118.2, 33.9],
    mode: "sea",
    label: "TSMC → US West Coast",
    riskScore: 8,
    chokepoints: ["cp-taiwan-strait"],
  },
  {
    id: "sr-tsmc-eu",
    from: [121.5, 25.0],
    to: [4.9, 52.3],
    mode: "sea",
    label: "TSMC → Europe",
    riskScore: 7,
    chokepoints: ["cp-taiwan-strait", "cp-malacca", "cp-suez"],
  },
  {
    id: "sr-samsung-us",
    from: [127.0, 37.5],
    to: [-118.2, 33.9],
    mode: "sea",
    label: "Samsung → US West Coast",
    riskScore: 4,
    chokepoints: [],
  },
  {
    id: "sr-unisem-eu",
    from: [101.6, 3.1],
    to: [3.7, 51.2],
    mode: "sea",
    label: "Unisem → Europe",
    riskScore: 6,
    chokepoints: ["cp-malacca", "cp-suez"],
  },
  {
    id: "sr-smic-sea",
    from: [121.4, 31.2],
    to: [101.6, 3.1],
    mode: "sea",
    label: "SMIC → Malaysia (packaging)",
    riskScore: 7,
    chokepoints: ["cp-malacca"],
  },
  // Air routes
  {
    id: "ar-asml-tw",
    from: [4.9, 52.3],
    to: [121.5, 25.0],
    mode: "air",
    label: "ASML → TSMC (EUV parts)",
    riskScore: 3,
    chokepoints: ["cp-schiphol"],
  },
  {
    id: "ar-samsung-us",
    from: [127.0, 37.5],
    to: [-97.0, 32.7],
    mode: "air",
    label: "Samsung → US (express)",
    riskScore: 3,
    chokepoints: ["cp-incheon-air"],
  },
  {
    id: "ar-renesas-eu",
    from: [139.7, 35.6],
    to: [11.8, 48.1],
    mode: "air",
    label: "Renesas → Germany (auto MCUs)",
    riskScore: 2,
    chokepoints: [],
  },
  // Land routes
  {
    id: "lr-china-eu",
    from: [121.4, 31.2],
    to: [10.4, 51.1],
    mode: "land",
    label: "China → Europe (rail)",
    riskScore: 6,
    chokepoints: ["cp-silk-road"],
  },
  {
    id: "lr-us-mx",
    from: [-112.0, 33.4],
    to: [-106.4, 31.7],
    mode: "land",
    label: "TSMC AZ → Mexico (assembly)",
    riskScore: 3,
    chokepoints: ["cp-us-mexico"],
  },
];

// Route colors by mode
export const modeConfig: Record<TransportMode, { color: string; label: string; icon: string }> = {
  sea: { color: "hsl(var(--primary))", label: "Sea", icon: "🚢" },
  air: { color: "hsl(var(--risk-medium))", label: "Air", icon: "✈️" },
  land: { color: "hsl(var(--risk-low))", label: "Land", icon: "🚛" },
};
