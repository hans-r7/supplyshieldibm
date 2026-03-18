import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SupplierProvider } from "@/context/SupplierContext";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import WeatherRisks from "./pages/WeatherRisks";
import GeopoliticalRisks from "./pages/GeopoliticalRisks";
import Mitigation from "./pages/Mitigation";
import AgentLog from "./pages/AgentLog";
import NotFound from "./pages/NotFound";
import Escalation from "./pages/Escalation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SupplierProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/weather" element={<WeatherRisks />} />
              <Route path="/geopolitical" element={<GeopoliticalRisks />} />
              <Route path="/mitigation" element={<Mitigation />} />
              <Route path="/agent-log" element={<AgentLog />} />
              <Route path="/escalation" element={<Escalation />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SupplierProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
