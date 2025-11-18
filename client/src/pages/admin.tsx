import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft } from "lucide-react";
import { CompanyManagement } from "@/components/admin/company-management";
import { CurrencyManagement } from "@/components/admin/currency-management";
import { TeamManagement } from "@/components/admin/team-management";
import { FinancialOverview } from "@/components/admin/financial-overview";
import { PortfolioOverview } from "@/components/admin/portfolio-overview";
import { DividendDistribution } from "@/components/admin/dividend-distribution";
import { BulkPriceUpdate } from "@/components/admin/bulk-price-update";
import { PasswordManagement } from "@/components/admin/password-management";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ensureAdminTokenSupport,
  getAdminToken,
  setAdminToken as persistAdminToken,
  subscribeToAdminToken,
} from "@/lib/adminToken";

export default function Admin() {
  const [tokenInput, setTokenInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    ensureAdminTokenSupport();
    setTokenInput(getAdminToken() ?? "");

    const unsubscribe = subscribeToAdminToken((token) => {
      setTokenInput(token ?? "");
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSaveToken = () => {
    const cleanedToken = tokenInput.trim();
    persistAdminToken(cleanedToken || null);
    setStatusMessage(
      cleanedToken
        ? "Admin token applied to all admin requests."
        : "Admin token cleared."
    );
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleClear = () => {
    setTokenInput("");
    persistAdminToken(null);
    setStatusMessage("Admin token cleared.");
    setTimeout(() => setStatusMessage(null), 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Cash or Crash - Administration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8 rounded-lg border border-dashed border-muted-foreground/40 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1">
                  <Label htmlFor="admin-token">Admin token</Label>
                  <Input
                    id="admin-token"
                    type="password"
                    placeholder="Paste the ADMIN_TOKEN value"
                    value={tokenInput}
                    onChange={(event) => setTokenInput(event.target.value)}
                    autoComplete="off"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Stored locally and sent as the{" "}
                    <code className="text-[11px]">x-admin-token</code> header on every
                    admin API request.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button onClick={handleSaveToken}>
                    Apply Token
                  </Button>
                </div>
              </div>
              {statusMessage && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  {statusMessage}
                </p>
              )}
            </div>

            <Tabs defaultValue="portfolios" className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="portfolios">Portföyler</TabsTrigger>
                <TabsTrigger value="financial">Mali Durum</TabsTrigger>
                <TabsTrigger value="dividend">Temettü</TabsTrigger>
                <TabsTrigger value="bulk-update">Toplu Güncelleme</TabsTrigger>
                <TabsTrigger value="companies">Şirketler</TabsTrigger>
                <TabsTrigger value="currencies">Dövizler</TabsTrigger>
                <TabsTrigger value="teams">Takımlar</TabsTrigger>
                <TabsTrigger value="passwords">Şifreler</TabsTrigger>
              </TabsList>
              
              <TabsContent value="portfolios" className="mt-6">
                <PortfolioOverview />
              </TabsContent>
              
              <TabsContent value="financial" className="mt-6">
                <FinancialOverview />
              </TabsContent>
              
              <TabsContent value="dividend" className="mt-6">
                <DividendDistribution />
              </TabsContent>

              <TabsContent value="bulk-update" className="mt-6">
                <BulkPriceUpdate />
              </TabsContent>
              
              <TabsContent value="companies" className="mt-6">
                <CompanyManagement />
              </TabsContent>
              
              <TabsContent value="currencies" className="mt-6">
                <CurrencyManagement />
              </TabsContent>
              
              <TabsContent value="teams" className="mt-6">
                <TeamManagement />
              </TabsContent>
              
              <TabsContent value="passwords" className="mt-6">
                <PasswordManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
