import { Globe, Cloud, AlertTriangle, Shield, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import TestApiButton from "./TestApiButton";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { title: "Dashboard", path: "/", icon: Globe },
  { title: "Weather Risks", path: "/weather", icon: Cloud },
  { title: "Geopolitical Risks", path: "/geopolitical", icon: AlertTriangle },
  { title: "Mitigation", path: "/mitigation", icon: Shield },
  { title: "Agent Log", path: "/agent-log", icon: Activity },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "bg-nav border-r border-border flex flex-col shrink-0 transition-all duration-200 ease-linear relative",
          collapsed ? "w-[56px]" : "w-[220px]"
        )}
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-nav text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>

        <nav className="flex flex-col py-4 gap-1">
          {navItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 text-sm transition-all duration-200 cascade-transition",
                      collapsed ? "px-0 py-2.5 justify-center" : "px-5 py-2.5",
                      isActive
                        ? "border-l-2 border-primary bg-surface-overlay text-foreground font-medium"
                        : "border-l-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-overlay/50"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </NavLink>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="text-xs">
                  {item.title}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>

        <div className={cn(
          "mt-auto border-t border-border flex flex-col gap-2 transition-all duration-200",
          collapsed ? "p-2 items-center" : "p-4"
        )}>
          {!collapsed && (
            <>
              <TestApiButton />
              <p className="text-[10px] text-muted-foreground font-mono-data uppercase tracking-widest text-center mt-2">
                IBM watsonx Hackathon
              </p>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default AppSidebar;
