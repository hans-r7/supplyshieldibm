import { useSuppliers } from "@/context/SupplierContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRiskLevel } from "@/data/suppliers";

const mockMetrics: Record<string, { shipments: number; cost: number; onTime: number; leadDays: number; defectRate: number }> = {
  "tsmc-tw":    { shipments: 142, cost: 48200000, onTime: 91, leadDays: 34, defectRate: 0.02 },
  "samsung-kr": { shipments: 98,  cost: 31500000, onTime: 94, leadDays: 28, defectRate: 0.04 },
  "renesas-jp": { shipments: 76,  cost: 12800000, onTime: 97, leadDays: 21, defectRate: 0.01 },
  "asml-nl":    { shipments: 12,  cost: 89000000, onTime: 88, leadDays: 90, defectRate: 0.00 },
  "tsmc-az":    { shipments: 54,  cost: 22100000, onTime: 96, leadDays: 18, defectRate: 0.03 },
  "infineon-de":{ shipments: 63,  cost: 9400000,  onTime: 95, leadDays: 22, defectRate: 0.02 },
  "smic-cn":    { shipments: 110, cost: 15600000, onTime: 82, leadDays: 40, defectRate: 0.06 },
  "unisem-my":  { shipments: 87,  cost: 6200000,  onTime: 89, leadDays: 26, defectRate: 0.05 },
};

const formatCost = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`;

const riskBadgeClass: Record<string, string> = {
  critical: "bg-risk-critical/15 text-risk-critical",
  high: "bg-risk-high/15 text-risk-high",
  medium: "bg-risk-medium/15 text-risk-medium",
  low: "bg-risk-low/15 text-risk-low",
};

const SupplierMetricsTable = () => {
  const { suppliers } = useSuppliers();

  return (
    <div className="card-glow rounded bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Supplier Metrics</h3>
        <p className="text-xs text-muted-foreground">YTD shipment and cost overview</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground">Supplier</TableHead>
            <TableHead className="text-muted-foreground text-right">Shipments</TableHead>
            <TableHead className="text-muted-foreground text-right">Total Cost</TableHead>
            <TableHead className="text-muted-foreground text-right">On-Time %</TableHead>
            <TableHead className="text-muted-foreground text-right">Lead Time</TableHead>
            <TableHead className="text-muted-foreground text-right">Defect Rate</TableHead>
            <TableHead className="text-muted-foreground text-center">Risk</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((s) => {
            const m = mockMetrics[s.id] ?? { shipments: 0, cost: 0, onTime: 0, leadDays: 0, defectRate: 0 };
            const level = getRiskLevel(s.riskScore);
            return (
              <TableRow key={s.id} className="border-border">
                <TableCell>
                  <div>
                    <span className="font-medium text-foreground text-sm">{s.name}</span>
                    <p className="text-xs text-muted-foreground">{s.component}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-foreground">{m.shipments}</TableCell>
                <TableCell className="text-right font-mono text-sm text-foreground">{formatCost(m.cost)}</TableCell>
                <TableCell className="text-right font-mono text-sm">
                  <span className={m.onTime >= 95 ? "text-risk-low" : m.onTime >= 90 ? "text-risk-medium" : "text-risk-critical"}>
                    {m.onTime}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-foreground">{m.leadDays}d</TableCell>
                <TableCell className="text-right font-mono text-sm text-foreground">{m.defectRate}%</TableCell>
                <TableCell className="text-center">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded capitalize ${riskBadgeClass[level]}`}>
                    {level}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplierMetricsTable;
