import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import TeamLogin from "@/pages/team-login";
import AdminLogin from "@/pages/admin-login";
import TeamDashboard from "@/pages/team-dashboard";
import Admin from "@/pages/admin";
import Designer from "@/pages/designer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TeamLogin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/team/:id" component={TeamDashboard} />
      <Route path="/admin" component={Admin} />
      <Route path="/designer" component={Designer} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="cash-or-crash-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
