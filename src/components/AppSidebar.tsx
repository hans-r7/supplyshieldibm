import { Globe, Cloud, AlertTriangle, Shield, Activity, PanelLeftClose, PanelLeft } from "lucide-react";
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
          "bg-nav border-r border-border flex flex-col shrink-0 transition-[width] duration-200 ease-linear overflow-hidden",
          collapsed ? "w-[52px]" : "w-[220px]"
        )}
      >
        {/* Collapse toggle */}
        <div className={cn(
          "flex items-center border-b border-border h-10 shrink-0",
          collapsed ? "justify-center px-0" : "justify-end px-2"
        )}>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col py-4 gap-1 px-3">
          {navItems.map((item) => {
            const link = (
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center text-sm rounded-md transition-colors duration-150",
                    collapsed ? "h-9 w-9 justify-center mx-auto" : "gap-3 px-3 py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary font-medium shadow-sm shadow-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-overlay/60"
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </NavLink>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8} className="text-xs font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.path}>{link}</div>;
          })}
        </nav>

        {/* Footer */}
        <div className={cn(
          "mt-auto border-t border-border flex flex-col transition-[padding] duration-200",
          collapsed ? "p-2 items-center" : "p-3 gap-2"
        )}>
          {!collapsed && (
            <>
              <TestApiButton />
              <p className="text-[10px] text-muted-foreground font-mono-data uppercase tracking-widest text-center mt-1">
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
