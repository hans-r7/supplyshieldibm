import { Globe, Cloud, AlertTriangle, Shield, Activity } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { title: "Dashboard", path: "/", icon: Globe },
  { title: "Weather Risks", path: "/weather", icon: Cloud },
  { title: "Geopolitical Risks", path: "/geopolitical", icon: AlertTriangle },
  { title: "Mitigation", path: "/mitigation", icon: Shield },
  { title: "Agent Log", path: "/agent-log", icon: Activity },
];

const AppSidebar = () => {
  return (
    <aside className="w-[220px] bg-nav border-r border-border flex flex-col shrink-0">
      <nav className="flex flex-col py-4 gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors cascade-transition ${
                isActive
                  ? "border-l-2 border-primary bg-surface-overlay text-foreground font-medium"
                  : "border-l-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-overlay/50"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground font-mono-data uppercase tracking-widest">
          IBM watsonx Hackathon
        </p>
      </div>
    </aside>
  );
};

export default AppSidebar;
