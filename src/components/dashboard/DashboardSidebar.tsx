import { Home, Search, History, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Logo } from "@/components/khoji/Logo";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home, end: true },
  { title: "New Research", url: "/dashboard/research", icon: Search },
  { title: "Past Briefs", url: "/dashboard/history", icon: History },
  { title: "Account", url: "/dashboard/account", icon: Settings },
];

export const DashboardSidebar = () => {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 text-xs text-muted-foreground border-t border-sidebar-border">
        Khoji Pro · Trial
      </div>
    </aside>
  );
};