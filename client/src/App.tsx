import { Switch, Route } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Landing from "@/pages/landing";
import TeamLogin from "@/pages/team-login";
import AdminLogin from "@/pages/admin-login";
import TeamDashboard from "@/pages/team-dashboard";
import Admin from "@/pages/admin";
import ApiTest from "@/components/ApiTest";
import api from "@/lib/api";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/team-login" component={TeamLogin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/team/:id" component={TeamDashboard} />
      <Route path="/admin" component={Admin} />
      <Route path="/api-test" component={ApiTest} />
    </Switch>
  );
}

function App() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Backend bağlantısı test ediliyor...");

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        console.log("Backend bağlantısı test ediliyor...");
        console.log("API Base URL:", import.meta.env.VITE_API_URL);
        console.log("All env vars:", import.meta.env);
        console.log("API instance baseURL:", api.defaults.baseURL);
        const response = await api.get("/");
        console.log("Backend bağlantısı başarılı ✅", response.data);
        setConnectionStatus("Backend bağlantısı başarılı ✅");
      } catch (error: any) {
        console.error("Bağlantı hatası ❌", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          config: {
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            method: error.config?.method
          }
        });
        setConnectionStatus(`Bağlantı hatası ❌: ${error.message}`);
      }
    };

    testBackendConnection();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="cash-or-crash-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <div>
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              background: '#f0f0f0', 
              padding: '10px', 
              textAlign: 'center', 
              zIndex: 9999,
              fontSize: '14px',
              borderBottom: '1px solid #ddd'
            }}>
              <h1>{connectionStatus}</h1>
            </div>
            <div style={{ marginTop: '60px' }}>
              <Router />
            </div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
