import { createContext, useContext, useState, ReactNode } from "react";
import { suppliers as initialSuppliers, Supplier } from "@/data/suppliers";

interface SupplierContextType {
  suppliers: Supplier[];
  updateSupplierRisk: (id: string, score: number) => void;
  updateSupplierEscalation: (id: string, status: "pending" | "approved" | "dismissed") => void;
  resetSuppliers: () => void;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider = ({ children }: { children: ReactNode }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);

  const updateSupplierRisk = (id: string, score: number) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newScore = Math.min(10, Math.max(1, score));
          // Reset escalation if it spikes back up to critical from below
          const becameCritical = newScore >= 7 && s.riskScore < 7;
          return { ...s, riskScore: newScore, ...(becameCritical && { escalationStatus: "pending" }) };
        }
        return s;
      })
    );
  };

  const updateSupplierEscalation = (id: string, status: "pending" | "approved" | "dismissed") => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, escalationStatus: status } : s))
    );
  };

  const resetSuppliers = () => setSuppliers(initialSuppliers);

  return (
    <SupplierContext.Provider value={{ suppliers, updateSupplierRisk, updateSupplierEscalation, resetSuppliers }}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSuppliers = () => {
  const ctx = useContext(SupplierContext);
  if (!ctx) throw new Error("useSuppliers must be used within SupplierProvider");
  return ctx;
};
