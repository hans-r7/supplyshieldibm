import { useSuppliers } from "@/context/SupplierContext";
import { ShieldAlert, AlertTriangle, CheckCircle, Mail, XCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const Escalation = () => {
  const { suppliers, updateSupplierEscalation } = useSuppliers();

  // Agent 4 (Escalation Agent) only surfaces suppliers with a Risk Score >= 7
  // Filter out the dismissed ones completely
  const activeEscalations = suppliers.filter((s) => s.riskScore >= 7 && s.escalationStatus !== "dismissed");

  const pendingSuppliers = activeEscalations.filter((s) => !s.escalationStatus || s.escalationStatus === "pending");
  const approvedSuppliers = activeEscalations.filter((s) => s.escalationStatus === "approved");

  const handleAction = (id: string, action: "pending" | "approved" | "dismissed", actionName: string, supplierName: string) => {
    updateSupplierEscalation(id, action);
    toast.success(`Action Taken: ${actionName}`, {
      description: `Human-in-the-loop decision routed for ${supplierName}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2 mb-1">
            <ShieldAlert className="h-5 w-5 text-risk-critical" />
            Agent 4: Escalation Gate
          </h2>
          <p className="text-sm text-muted-foreground">
            Human-in-the-loop decision queue for critical supply chain disruptions.
          </p>
        </div>
        <div className="card-glow rounded bg-card px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-risk-critical" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Pending Review</span>
          <span className="font-mono-data text-lg font-bold text-foreground ml-1">
            {pendingSuppliers.length}
          </span>
        </div>
      </div>

      {pendingSuppliers.length === 0 && approvedSuppliers.length === 0 ? (
        <div className="card-glow rounded bg-card p-12 text-center border border-border/50">
          <CheckCircle className="h-12 w-12 text-risk-low mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-1">No Active Escalations</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The Risk Scorer agent has not flagged any suppliers above the critical threshold (Score 7+). All active supply chains are operating within normal parameters.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-risk-critical" />
              Pending Review ({pendingSuppliers.length})
            </h3>
            {pendingSuppliers.length === 0 ? (
              <div className="card-glow rounded bg-card p-6 text-center border border-border/50">
                <p className="text-sm text-muted-foreground">All critical escalations have been reviewed.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="card-glow rounded bg-card border-l-4 border-l-risk-critical p-5 flex flex-col md:flex-row gap-6 md:items-center justify-between"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{supplier.name}</h3>
                        <span className="px-2 py-0.5 rounded text-xs font-mono-data font-bold bg-risk-critical/10 text-risk-critical">
                          Risk Score: {supplier.riskScore}/10
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-surface-overlay text-muted-foreground">
                          {supplier.country}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">AI Rationale:</strong> The Risk Scorer agent flagged this supplier due to extreme proximity to an active disruption event. Immediate human review is mandated.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleAction(supplier.id, "approved", "Approve Mitigation Plan", supplier.name)}
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded hover:brightness-110 active:scale-95 transition-all"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => toast.info(`Contacting ${supplier.name}...`, { description: "Simulated communication initiated." })}
                        className="flex items-center gap-2 px-3 py-2 bg-surface-overlay text-foreground text-xs font-semibold rounded border border-border hover:bg-surface-overlay/80 active:scale-95 transition-all"
                      >
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Contact
                      </button>
                      <button
                        onClick={() => handleAction(supplier.id, "dismissed", "Dismiss Alert", supplier.name)}
                        className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-xs font-semibold rounded hover:text-foreground hover:bg-surface-overlay active:scale-95 transition-all"
                      >
                        <XCircle className="h-4 w-4" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved Section */}
          {approvedSuppliers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-risk-low" />
                Approved Mitigations ({approvedSuppliers.length})
              </h3>
              <div className="grid gap-4 opacity-80">
                {approvedSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="card-glow rounded bg-card border-l-4 border-l-risk-low p-5 flex flex-col md:flex-row gap-6 md:items-center justify-between"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{supplier.name}</h3>
                        <span className="px-2 py-0.5 rounded text-xs font-mono-data font-bold bg-risk-low/10 text-risk-low">
                          Risk Score: {supplier.riskScore}/10
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-surface-overlay text-muted-foreground">
                          {supplier.country}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-primary/20 text-primary">
                          Mitigation Active
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Human-in-the-loop intervention confirmed. Alternative supply routes activated and buffering increased.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        disabled
                        className="flex items-center gap-2 px-3 py-2 bg-surface-overlay text-muted-foreground text-xs font-semibold rounded border border-border cursor-not-allowed"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Escalation;
