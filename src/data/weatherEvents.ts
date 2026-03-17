export interface WeatherEvent {
  id: string;
  event: string;
  country: string;
  severity: number;
  supplier: string;
  delayDays: number;
  status: "Active" | "Monitoring" | "Resolved";
}

export const weatherEvents: WeatherEvent[] = [
  { id: "we-1", event: "Typhoon Haikui", country: "Taiwan", severity: 8, supplier: "TSMC Taiwan", delayDays: 12, status: "Active" },
  { id: "we-2", event: "Hurricane Idalia", country: "USA", severity: 6, supplier: "TSMC Arizona", delayDays: 5, status: "Monitoring" },
  { id: "we-3", event: "Monsoon Flooding", country: "Malaysia", severity: 7, supplier: "Unisem Malaysia", delayDays: 9, status: "Active" },
  { id: "we-4", event: "Winter Blizzard", country: "South Korea", severity: 4, supplier: "Samsung Korea", delayDays: 3, status: "Resolved" },
  { id: "we-5", event: "Earthquake Aftershocks", country: "Japan", severity: 5, supplier: "Renesas Japan", delayDays: 6, status: "Monitoring" },
  { id: "we-6", event: "Flooding", country: "Germany", severity: 3, supplier: "Infineon Germany", delayDays: 2, status: "Resolved" },
];
