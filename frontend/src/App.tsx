import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import { ThemeProvider } from "./components/theme-provider";
import ProcessData from "./pages/ProcessData";
import ResultData from "./pages/ResultData";
import ResultCollation from "./pages/ResultCollation";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

import { AuthProvider } from "./admin/context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./admin/pages/Login";
import AdminLayout from "@/admin/layouts/AdminLayout";

// Placeholder components for admin pages
import AdminDashboard from "@/admin/pages/AdminDashboard";
import AdminProcessData from "./admin/pages/AdminProcessData";
import AdminResultData from "./admin/pages/AdminResultData";
import AdminCollation from "./admin/pages/AdminCollation";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminAudit from "./admin/pages/AdminAudit";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/process-data" element={<DashboardLayout><ProcessData /></DashboardLayout>} />
              <Route path="/result-data" element={<DashboardLayout><ResultData /></DashboardLayout>} />
              <Route path="/result-collation" element={<DashboardLayout><ResultCollation /></DashboardLayout>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={
                <ErrorBoundary>
                  <AdminLayout />
                </ErrorBoundary>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="process-data" element={<AdminProcessData />} />
                <Route path="result-data" element={<AdminResultData />} />
                <Route path="collation" element={<AdminCollation />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="audit" element={<AdminAudit />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
