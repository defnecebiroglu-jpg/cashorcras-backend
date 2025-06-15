import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUp, DollarSign, Briefcase, Users, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { type Team, type TeamPortfolio } from "@shared/schema";

export function PortfolioOverview() {
  const { toast } = useToast();
  const [sellDialog, setSellDialog] = useState<{
    isOpen: boolean;
    type: 'stock' | 'currency';
    item: any;
    teamId: number;
    maxAmount: number;
  } | null>(null);
  const [sellAmount, setSellAmount] = useState("");
  
  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const unassignStockMutation = useMutation({
    mutationFn: async ({ teamId, companyId, shares }: { teamId: number; companyId: number; shares: number }) => {
      const response = await fetch("/api/admin/unassign-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, companyId, shares }),
      });
      if (!response.ok) throw new Error("Failed to unassign stock");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ title: "Hisse satışı başarılı" });
      setSellDialog(null);
      setSellAmount("");
    },
    onError: () => {
      toast({ title: "Hisse satışı başarısız", variant: "destructive" });
    },
  });

  const unassignCurrencyMutation = useMutation({
    mutationFn: async ({ teamId, currencyId, amount }: { teamId: number; currencyId: number; amount: string }) => {
      const response = await fetch("/api/admin/unassign-currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, currencyId, amount }),
      });
      if (!response.ok) throw new Error("Failed to unassign currency");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({ title: "Döviz satışı başarılı" });
      setSellDialog(null);
      setSellAmount("");
    },
    onError: () => {
      toast({ title: "Döviz satışı başarısız", variant: "destructive" });
    },
  });

  const handleSellStock = (stock: any, teamId: number) => {
    setSellDialog({
      isOpen: true,
      type: 'stock',
      item: stock,
      teamId,
      maxAmount: stock.shares
    });
    setSellAmount(stock.shares.toString());
  };

  const handleSellCurrency = (currency: any, teamId: number) => {
    setSellDialog({
      isOpen: true,
      type: 'currency',
      item: currency,
      teamId,
      maxAmount: parseFloat(currency.amount)
    });
    setSellAmount(currency.amount);
  };

  const confirmSell = () => {
    if (!sellDialog || !sellAmount) return;

    const amount = parseFloat(sellAmount);
    if (amount <= 0 || amount > sellDialog.maxAmount) {
      toast({ title: "Geçersiz miktar", variant: "destructive" });
      return;
    }

    if (sellDialog.type === 'stock') {
      unassignStockMutation.mutate({
        teamId: sellDialog.teamId,
        companyId: sellDialog.item.companyId,
        shares: Math.floor(amount)
      });
    } else {
      unassignCurrencyMutation.mutate({
        teamId: sellDialog.teamId,
        currencyId: sellDialog.item.currencyId,
        amount: amount.toFixed(2)
      });
    }
  };

  const { data: portfolios, isLoading: portfoliosLoading } = useQuery<TeamPortfolio[]>({
    queryKey: ["/api/teams", "portfolios"],
    queryFn: async () => {
      if (!teams) return [];
      const portfolioPromises = teams.map(async (team) => {
        const response = await fetch(`/api/teams/${team.id}/portfolio`);
        if (!response.ok) throw new Error("Failed to fetch portfolio");
        return response.json();
      });
      return Promise.all(portfolioPromises);
    },
    enabled: !!teams,
  });

  if (teamsLoading || portfoliosLoading) {
    return <div>Portföyler yükleniyor...</div>;
  }

  const totalTeams = teams?.length || 0;
  const totalPortfolioValue = portfolios?.reduce((sum, portfolio) => 
    sum + parseFloat(portfolio.totalPortfolioValue), 0
  ) || 0;

  const averagePortfolioValue = totalTeams > 0 ? totalPortfolioValue / totalTeams : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Portföy Genel Bakış</h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Takım</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Portföy Değeri</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₺{totalPortfolioValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Portföy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₺{averagePortfolioValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Portfolios */}
      <div className="grid gap-6">
        {portfolios?.map((portfolio) => (
          <Card key={portfolio.team.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{portfolio.team.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Toplam: ₺{parseFloat(portfolio.totalPortfolioValue).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Özet</TabsTrigger>
                  <TabsTrigger value="stocks">Hisseler</TabsTrigger>
                  <TabsTrigger value="currencies">Dövizler</TabsTrigger>
                  <TabsTrigger value="startup">Girişim</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Nakit</p>
                      <p className="font-semibold">
                        ₺{parseFloat(portfolio.team.cashBalance).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Hisse Değeri</p>
                      <p className="font-semibold">
                        ₺{parseFloat(portfolio.totalStockValue).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Döviz Değeri</p>
                      <p className="font-semibold">
                        ₺{parseFloat(portfolio.totalCurrencyValue).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Girişim Değeri</p>
                      <p className="font-semibold">
                        ₺{portfolio.startup ? parseFloat(portfolio.startup.value).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : "0,00"}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stocks" className="mt-4">
                  {portfolio.stocks.length > 0 ? (
                    <div className="space-y-2">
                      {portfolio.stocks.map((stock) => (
                        <div key={stock.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img 
                              src={stock.company.logoUrl || "/api/placeholder/32/32"} 
                              alt={stock.company.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{stock.company.name}</p>
                              <p className="text-sm text-muted-foreground">{stock.company.symbol}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-medium">{stock.shares} adet</p>
                              <p className="text-sm text-muted-foreground">
                                ₺{(parseFloat(stock.company.sellPrice) * stock.shares).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} satış değeri
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSellStock(stock, portfolio.team.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Hisse senedi yok</p>
                  )}
                </TabsContent>

                <TabsContent value="currencies" className="mt-4">
                  {portfolio.currencies.length > 0 ? (
                    <div className="space-y-2">
                      {portfolio.currencies.map((currency) => (
                        <div key={currency.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img 
                              src={currency.currency.logoUrl || "/api/placeholder/32/32"} 
                              alt={currency.currency.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{currency.currency.name}</p>
                              <p className="text-sm text-muted-foreground">{currency.currency.code}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-medium">{parseFloat(currency.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</p>
                              <p className="text-sm text-muted-foreground">
                                ₺{(parseFloat(currency.amount) * parseFloat(currency.currency.sellRate)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} satış değeri
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSellCurrency(currency, portfolio.team.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Döviz yok</p>
                  )}
                </TabsContent>

                <TabsContent value="startup" className="mt-4">
                  {portfolio.startup ? (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-start gap-3">
                        <Briefcase className="h-6 w-6 text-purple-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium">{portfolio.startup.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{portfolio.startup.description}</p>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Sektör</p>
                              <p className="font-medium">{portfolio.startup.industry}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Risk Seviyesi</p>
                              <Badge variant={
                                portfolio.startup.riskLevel === 'Düşük' ? 'default' :
                                portfolio.startup.riskLevel === 'Orta' ? 'secondary' :
                                portfolio.startup.riskLevel === 'Orta-Yüksek' ? 'destructive' : 'destructive'
                              }>
                                {portfolio.startup.riskLevel}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Yatırım Değeri</p>
                              <p className="font-medium">
                                ₺{parseFloat(portfolio.startup.value).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Girişim yok</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sell Confirmation Dialog */}
      <Dialog open={sellDialog?.isOpen || false} onOpenChange={(open) => {
        if (!open) {
          setSellDialog(null);
          setSellAmount("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {sellDialog?.type === 'stock' ? 'Hisse Satışı' : 'Döviz Satışı'}
            </DialogTitle>
          </DialogHeader>
          {sellDialog && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={sellDialog.type === 'stock' ? 
                      sellDialog.item.company.logoUrl : 
                      sellDialog.item.currency.logoUrl} 
                    alt=""
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-medium">
                      {sellDialog.type === 'stock' ? 
                        sellDialog.item.company.name : 
                        sellDialog.item.currency.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Mevcut: {sellDialog.maxAmount} {sellDialog.type === 'stock' ? 'adet' : sellDialog.item.currency.code}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Satış Miktarı
                </label>
                <Input
                  type="number"
                  min="0"
                  max={sellDialog.maxAmount}
                  step={sellDialog.type === 'stock' ? '1' : '0.01'}
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  placeholder={`Max ${sellDialog.maxAmount}`}
                />
                <p className="text-xs text-muted-foreground">
                  Satış değeri: ₺{sellDialog.type === 'stock' ? 
                    (parseFloat(sellAmount || "0") * parseFloat(sellDialog.item.company.sellPrice)).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) :
                    (parseFloat(sellAmount || "0") * parseFloat(sellDialog.item.currency.sellRate)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })
                  }
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSellDialog(null);
                    setSellAmount("");
                  }}
                >
                  İptal
                </Button>
                <Button 
                  onClick={confirmSell}
                  disabled={unassignStockMutation.isPending || unassignCurrencyMutation.isPending || !sellAmount || parseFloat(sellAmount) <= 0}
                >
                  {(unassignStockMutation.isPending || unassignCurrencyMutation.isPending) ? "Satılıyor..." : "Sat"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}