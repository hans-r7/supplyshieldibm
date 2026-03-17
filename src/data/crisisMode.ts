export interface CrisisLogEntry {
  id: string;
  timestamp: string;
  agent: "Risk Scorer" | "Supplier Mapper" | "Mitigation Advisor" | "Escalation Agent";
  title: string;
  reasoning: string;
}

export interface CrisisAlert {
  id: string;
  event: string;
  severity: number;
  supplier: string;
  description: string;
}

export const crisisStats = {
  year: 2021,
  title: "2021 Global Chip Crisis",
  peakShortage: "169 industries affected",
  autoLosses: "$210B revenue lost",
  leadTimeSpike: "26 → 52 weeks avg",
  priceIncrease: "+15–25% across nodes",
};

export const crisisAlerts: CrisisAlert[] = [
  { id: "ca-1", event: "Renesas Naka Factory Fire", severity: 10, supplier: "Renesas Japan", description: "Fire destroyed N3 production building. 2/3 of automotive MCU output halted." },
  { id: "ca-2", event: "Texas Winter Storm Uri", severity: 9, supplier: "TSMC Arizona", description: "Samsung Austin & NXP fabs offline for 6+ weeks due to power grid collapse." },
  { id: "ca-3", event: "Suez Canal Blockage", severity: 8, supplier: "Multiple", description: "Ever Given grounding blocked $9.6B/day in trade for 6 days." },
  { id: "ca-4", event: "Malaysia COVID Lockdowns", severity: 9, supplier: "Unisem Malaysia", description: "MCO 3.0 shuttered OSAT packaging plants for 2 months." },
  { id: "ca-5", event: "Taiwan Drought", severity: 7, supplier: "TSMC Taiwan", description: "Worst drought in 56 years. TSMC water trucking operations activated." },
  { id: "ca-6", event: "China Power Rationing", severity: 8, supplier: "SMIC China", description: "Rolling blackouts in Jiangsu province disrupted fab operations." },
];

export const crisisLogEntries: CrisisLogEntry[] = [
  { id: "cl-01", timestamp: "03:45:12", agent: "Escalation Agent", title: "CRITICAL: All automotive MCU supply chains compromised", reasoning: "Renesas fire + Texas storm created dual-source failure for 67% of auto-grade chips" },
  { id: "cl-02", timestamp: "03:44:30", agent: "Risk Scorer", title: "Global risk index elevated to SEVERE (9.2/10)", reasoning: "Concurrent multi-region disruptions exceed historical precedent" },
  { id: "cl-03", timestamp: "03:40:15", agent: "Mitigation Advisor", title: "Emergency allocation protocol activated", reasoning: "Recommending customer priority tiers based on contract obligations and margin" },
  { id: "cl-04", timestamp: "03:38:00", agent: "Supplier Mapper", title: "Cascade analysis: 14 tier-2 suppliers impacted", reasoning: "Renesas fire creates downstream shortage in ABS, ADAS, and powertrain modules" },
  { id: "cl-05", timestamp: "03:30:22", agent: "Escalation Agent", title: "Board-level briefing triggered", reasoning: "Revenue exposure exceeds $2.1B across 3 business units" },
  { id: "cl-06", timestamp: "03:25:10", agent: "Risk Scorer", title: "Suez blockage compounds lead time pressure", reasoning: "European-bound wafer shipments delayed 14+ days, buffer stock depleting" },
  { id: "cl-07", timestamp: "03:20:45", agent: "Mitigation Advisor", title: "Air freight surge pricing activated for critical lots", reasoning: "Cost increase 8x but prevents line-down at 3 major OEM customers" },
  { id: "cl-08", timestamp: "03:15:33", agent: "Supplier Mapper", title: "Malaysia lockdown zones mapped to 23 OSAT facilities", reasoning: "Packaging capacity reduced 40% across region" },
];

// In crisis mode, all supplier scores go critical
export const crisisSupplierOverrides: Record<string, number> = {
  "tsmc-tw": 9,
  "samsung-kr": 8,
  "renesas-jp": 10,
  "asml-nl": 5,
  "tsmc-az": 9,
  "infineon-de": 7,
  "smic-cn": 8,
  "unisem-my": 9,
};
