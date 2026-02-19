import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Activity, Clock, FileText, ChevronLeft, ChevronRight, MapPin, Users, CreditCard, Building, Landmark, Settings, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

const navItems = [
  { title: "Process Data", path: "/process-data", icon: Activity },
  { title: "Result Data", path: "/result-data", icon: Clock },
  { title: "Result Collation", path: "/result-collation", icon: FileText },
];

const topStats = [
  { label: "UNITS OBSERVING", value: "207", sub: "Real-time Feed", icon: MapPin, color: "bg-primary text-primary-foreground" },
  { label: "REGISTERED VOTERS", value: "1,680,315", sub: "FCT Wide", icon: Users, color: "bg-chart-blue text-white" },
  { label: "PVC COLLECTED", value: "-", sub: "% Rate", icon: CreditCard, color: "bg-chart-orange text-white" },
  { label: "WARDS", value: "62", sub: "62/62 Online", icon: Building, color: "bg-chart-yellow text-primary-foreground" },
  { label: "POLLING UNITS", value: "2,822", sub: "Total Base", icon: Landmark, color: "bg-chart-pink text-white" },
];

function ElectionClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const formatted = time.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return (
    <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-card px-4 py-2 glow-green shrink-0">
      <Clock className="h-4 w-4 text-primary animate-pulse-glow" />
      <div className="text-right">
        <div className="text-sm font-bold text-primary">{formatted}</div>
        <div className="text-[10px] tracking-widest text-muted-foreground hidden sm:block">ELECTION CLOCK</div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { setTheme, theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        ${collapsed ? "lg:w-16" : "lg:w-56"} 
        fixed lg:sticky top-0 h-screen z-50
        flex flex-col border-r border-border bg-sidebar transition-all duration-300 shrink-0
        ${mobileOpen ? "w-56 translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-lg shrink-0 glow-green">
            F
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="animate-fade-in">
              <div className="font-bold text-foreground text-sm">FCT DECIDES</div>
              <div className="text-xs text-primary">2026</div>
            </div>
          )}
        </div>

        <nav className="mt-6 flex flex-col gap-1 px-3 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:translate-x-1 ${isActive ? "text-primary font-semibold bg-primary/10 shine-border border border-primary/20" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "drop-shadow-[0_0_6px_hsl(160,80%,45%)]" : ""}`} />
                {(!collapsed || mobileOpen) && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center border-t border-border p-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Stats Bar - STICKY */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          {/* Mobile menu button + clock row on mobile */}
          <div className="flex items-center gap-2 px-4 py-2 lg:hidden">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground text-xs">F</div>
              <span className="font-bold text-foreground text-sm">FCT DECIDES</span>
            </div>
            <div className="ml-auto"><ElectionClock /></div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 px-4 lg:px-6 py-3">
            <div className="flex flex-1 gap-2 lg:gap-3 overflow-x-auto scrollbar-hide stagger-children">
              {topStats.map((stat) => (
                <div key={stat.label} className={`rounded-xl min-w-[140px] lg:min-w-0 flex-1 flex items-start justify-between py-3 px-3 lg:px-4 hover:scale-[1.02] transition-transform duration-200 shadow-md ${stat.color}`}>
                  <div>
                    <div className="text-[9px] lg:text-[10px] tracking-wider opacity-90">{stat.label}</div>
                    <div className="text-lg lg:text-xl font-bold">{stat.value}</div>
                    <div className="text-[9px] lg:text-[10px] opacity-80">{stat.sub}</div>
                  </div>
                  <stat.icon className="h-4 w-4 opacity-80" />
                </div>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-2">
              <ElectionClock />
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground transition-all duration-300 relative h-9 w-9 flex items-center justify-center"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
