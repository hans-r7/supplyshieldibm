import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

const Navbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-nav border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <div className="flex items-baseline gap-3">
          <h1 className="text-foreground font-bold text-lg tracking-tight">SupplyShield</h1>
          <span className="text-muted-foreground text-sm hidden sm:inline">Semiconductor Supply Chain Risk Radar</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-risk-low animate-pulse" />
        <time className="font-mono-data text-sm text-muted-foreground">
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </time>
      </div>
    </header>
  );
};

export default Navbar;
