import { useState } from "react";
import { scoreSupplierRisk } from "../lib/watsonxService";

export function useRiskScorer(suppliers, setSuppliers, addAgentLog) {
  const [isScoring, setIsScoring] = useState(false);
  const [apiStatus, setApiStatus] = useState({ status: "idle", message: "" });

  async function runRiskScoringAgent(eventDescription, affectedRegion) {
    setIsScoring(true);
    setApiStatus({ status: "pending", message: "Calling IBM API..." });

    // Find suppliers in the affected region (guard against undefined country)
    const affectedSuppliers = suppliers.filter((s) =>
      typeof s.country === "string" && s.country.toLowerCase().includes(affectedRegion.toLowerCase())
    );

    addAgentLog({
      timestamp: new Date().toLocaleTimeString(),
      agent: "Risk Scorer",
      action: `Scanning ${affectedSuppliers.length} suppliers in ${affectedRegion}`,
      reasoning: "New event detected — initiating risk assessment pipeline",
    });

    // Score each affected supplier via watsonx.ai
    for (const supplier of affectedSuppliers) {
      try {
        const result = await scoreSupplierRisk(
          supplier.name,
          eventDescription,
          affectedRegion,
          setApiStatus
        );

        if (result) {
          // Update the supplier's risk score in shared state
          setSuppliers((prev) =>
            prev.map((s) =>
              s.name === supplier.name
                ? { ...s, riskScore: result.riskScore }
                : s
            )
          );

          addAgentLog({
            timestamp: new Date().toLocaleTimeString(),
            agent: "Risk Scorer",
            action: `${supplier.name} score updated → ${result.riskScore}/10`,
            reasoning: result.reasoning,
          });

          // If score is critical, log escalation
          if (result.riskScore >= 8) {
            addAgentLog({
              timestamp: new Date().toLocaleTimeString(),
              agent: "Escalation Agent",
              action: `Critical alert raised for ${supplier.name}`,
              reasoning: result.recommendation,
            });
          }
        }
      } catch (err) {
        setApiStatus({ status: "error", message: `Scoring failed for ${supplier.name}: ${err}` });
        console.error(`Scoring failed for ${supplier.name}:`, err);
      }
    }

    setIsScoring(false);
  }

  return { runRiskScoringAgent, isScoring, apiStatus };
}
