import { useState, useEffect } from "react";
import { Shield, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const [time, setTime] = useState(new Date());
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return true;
  });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="h-14 bg-nav border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <div className="flex items-baseline gap-3">
          <h1 className="text-foreground font-bold text-lg tracking-tight">SupplyShield</h1>
          <span className="text-muted-foreground text-sm hidden sm:inline">Semiconductor Supply Chain Risk Radar</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDark((d) => !d)}
          className="p-1.5 rounded hover:bg-muted cascade-transition text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-risk-low animate-pulse" />
          <time className="font-mono-data text-sm text-muted-foreground">
            {time.toLocaleTimeString("en-US", { hour12: false })}
          </time>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
