import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { NavigationTabs } from "@/components/dashboard/navigation-tabs";
import { StockMarketDesk } from "@/components/dashboard/stock-market-desk";
import { CurrencyDesk } from "@/components/dashboard/currency-desk";
import { StartupDesk } from "@/components/dashboard/startup-desk";
import { ChartLine, LogOut } from "lucide-react";
import type { TeamPortfolio } from "@shared/schema";

export default function TeamDashboard() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"stocks" | "currency" | "startup">("stocks");
  
  const teamId = parseInt(params.id || "0");
  const storedTeamId = localStorage.getItem("teamId");
  const storedTeamName = localStorage.getItem("teamName");

  // Check if user is authorized to access this team's dashboard
  useEffect(() => {
    if (!storedTeamId || parseInt(storedTeamId) !== teamId) {
      setLocation("/");
      return;
    }
  }, [teamId, storedTeamId, setLocation]);

  const { data: portfolio, isLoading } = useQuery<TeamPortfolio>({
    queryKey: ["/api/teams", teamId, "portfolio"],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}/portfolio`);
      if (!response.ok) throw new Error("Failed to fetch portfolio");
      return response.json();
    },
    enabled: !!teamId && !!storedTeamId,
  });

  const handleLogout = () => {
    localStorage.removeItem("teamId");
    localStorage.removeItem("teamName");
    setLocation("/");
  };

  if (!storedTeamId || parseInt(storedTeamId) !== teamId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Portföy bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ChartLine className="text-primary-foreground h-4 w-4" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">Cash or Crash</h1>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-semibold text-slate-700">
                  {storedTeamName || portfolio?.team.name}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-slate-600">Nakit Bakiye</div>
                <div className="text-lg font-bold text-slate-900">
                  ₺{portfolio ? parseFloat(portfolio.team.cashBalance).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600">Toplam Portföy</div>
                <div className="text-lg font-bold text-green-600">
                  ₺{portfolio ? parseFloat(portfolio.totalPortfolioValue).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "stocks" && <StockMarketDesk teamId={teamId} />}
        {activeTab === "currency" && <CurrencyDesk teamId={teamId} />}
        {activeTab === "startup" && <StartupDesk teamId={teamId} />}
      </main>
    </div>
  );
}