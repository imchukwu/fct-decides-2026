
import { useState } from "react";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    FileText,
    BarChart,
    ClipboardList,
    Users,
    ShieldAlert,
    Menu,
    X,
    LogOut,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout() {
    console.log("AdminLayout: Rendering");
    const { user, logout, isLoading } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-background">Loading authentication...</div>;
    }

    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    const navItems = [
        {
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
            roles: ["SUPER_ADMIN", "CLERK"],
        },
        {
            title: "Process Data",
            path: "/admin/process-data",
            icon: FileText,
            roles: ["SUPER_ADMIN", "CLERK"],
        },
        {
            title: "Result Data",
            path: "/admin/result-data",
            icon: BarChart,
            roles: ["SUPER_ADMIN", "CLERK"],
        },
        {
            title: "Result Collation",
            path: "/admin/collation",
            icon: ClipboardList,
            roles: ["SUPER_ADMIN", "CLERK"],
        },
        {
            title: "User Management",
            path: "/admin/users",
            icon: Users,
            roles: ["SUPER_ADMIN"],
        },
        {
            title: "Audit Trails",
            path: "/admin/audit",
            icon: ShieldAlert,
            roles: ["SUPER_ADMIN"],
        },
    ];

    const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role));

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-sidebar border-r border-border
          ${sidebarOpen ? "w-64" : "w-20 hidden lg:flex"}
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                {/* Sidebar Header */}
                <div className="flex items-center h-16 px-4 border-b border-border">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                            A
                        </div>
                        {(sidebarOpen || mobileOpen) && <span>FCT Admin</span>}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* User Profile Summary */}
                <div className={`p-4 border-b border-border ${!sidebarOpen && "lg:justify-center lg:flex"}`}>
                    <div className={`flex items-center gap-3 ${!sidebarOpen && "lg:hidden"}`}>
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/20 text-primary">
                                {(user.name || user.email).charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <div className="text-sm font-medium truncate">{user.name || user.email}</div>
                            <div className="text-xs text-muted-foreground truncate">{user.role.replace("_", " ")}</div>
                        </div>
                    </div>
                    {/* Collapsed Icon View */}
                    {!sidebarOpen && (
                        <div className="hidden lg:flex" title={user.name || user.email}>
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                    {(user.name || user.email).charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    {filteredNavItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium
                  ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}
                  ${!sidebarOpen && "lg:justify-center"}
                `}
                                title={!sidebarOpen ? item.title : undefined}
                                onClick={() => setMobileOpen(false)}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {(sidebarOpen || mobileOpen) && <span>{item.title}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 ${!sidebarOpen && "lg:justify-center px-0"}`}
                        onClick={logout}
                    >
                        <LogOut className="h-5 w-5" />
                        {(sidebarOpen || mobileOpen) && <span>Sign Out</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Top Header */}
                <header className="h-16 flex items-center justify-between px-4 border-b border-border bg-background/95 backdrop-blur z-40 sticky top-0">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hidden lg:flex"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X className="h-5 w-5 rotate-45" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        <h1 className="text-lg font-semibold truncate">
                            {navItems.find(i => location.pathname.startsWith(i.path))?.title || "Dashboard"}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs text-muted-foreground hidden sm:block">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
