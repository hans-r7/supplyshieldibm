import { createContext, useContext, useState, ReactNode } from "react";
import { suppliers as initialSuppliers, Supplier } from "@/data/suppliers";

interface SupplierContextType {
  suppliers: Supplier[];
  updateSupplierRisk: (id: string, score: number) => void;
  resetSuppliers: () => void;
}

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export const SupplierProvider = ({ children }: { children: ReactNode }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);

  const updateSupplierRisk = (id: string, score: number) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, riskScore: Math.min(10, Math.max(1, score)) } : s))
    );
  };

  const resetSuppliers = () => setSuppliers(initialSuppliers);

  return (
    <SupplierContext.Provider value={{ suppliers, updateSupplierRisk, resetSuppliers }}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSuppliers = () => {
  const ctx = useContext(SupplierContext);
  if (!ctx) throw new Error("useSuppliers must be used within SupplierProvider");
  return ctx;
};
