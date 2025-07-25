import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, DollarSign, BarChart3, PlusCircle, MinusCircle } from "lucide-react";
import type { Company, TeamPortfolio } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

interface StockMarketDeskProps {
  teamId: number;
}

export function StockMarketDesk({ teamId }: StockMarketDeskProps) {
  const [selectedStock, setSelectedStock] = useState<Company | null>(null);
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: portfolio, isLoading: portfolioLoading } = useQuery<TeamPortfolio>({
    queryKey: ["/api/teams", teamId, "portfolio"],
    queryFn: async () => {
      const response = await fetch(`/api/teams/${teamId}/portfolio`);
      if (!response.ok) throw new Error("Failed to fetch portfolio");
      return response.json();
    },
  });

  const { data: companies, isLoading: companiesLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const tradeMutation = useMutation({
    mutationFn: async ({ companyId, shares, type }: { companyId: number; shares: number; type: "buy" | "sell" }) => {
      const response = await fetch(`/api/teams/${teamId}/trade`, {
        method: "POST",
        body: JSON.stringify({ companyId, shares, type }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to complete trade");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", teamId, "portfolio"] });
      setIsTradeDialogOpen(false);
      setTradeAmount("");
      toast({
        title: "İşlem Başarılı",
        description: `${tradeType === "buy" ? "Alım" : "Satış"} işlemi tamamlandı.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "İşlem Başarısız",
        description: error.message || "Bir hata oluştu",
        variant: "destructive",
      });
    },
  });

  const handleTrade = () => {
    if (!selectedStock || !tradeAmount) return;
    
    const shares = parseInt(tradeAmount);
    if (shares <= 0) {
      toast({
        title: "Geçersiz Miktar",
        description: "Lütfen geçerli bir hisse miktarı girin",
        variant: "destructive",
      });
      return;
    }

    tradeMutation.mutate({
      companyId: selectedStock.id,
      shares,
      type: tradeType,
    });
  };

  const openTradeDialog = (company: Company, type: "buy" | "sell") => {
    setSelectedStock(company);
    setTradeType(type);
    setTradeAmount("");
    setIsTradeDialogOpen(true);
  };

  const getOwnedShares = (companyId: number) => {
    return portfolio?.stocks.find(stock => stock.companyId === companyId)?.shares || 0;
  };

  const getPriceChange = (company: Company) => {
    // Simulated price change for demonstration
    const changePercentage = (Math.random() - 0.5) * 10;
    return changePercentage;
  };

  if (portfolioLoading || companiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Nakit Bakiye</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  ₺{portfolio ? parseFloat(portfolio.team.cashBalance).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Hisse Değeri</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  ₺{portfolio ? parseFloat(portfolio.totalStockValue).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Toplam Değer</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  ₺{portfolio ? parseFloat(portfolio.totalPortfolioValue).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Team's Stock Portfolio */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Hisse Senedi Portföyünüz
              </CardTitle>
              <p className="text-sm text-muted-foreground">Mevcut varlıklar ve performans</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio?.stocks.map((stock) => {
                  const currentValue = parseFloat(stock.company.price) * stock.shares;
                  const priceChange = getPriceChange(stock.company);
                  return (
                    <div key={stock.id} className="group p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={stock.company.logoUrl || "/api/placeholder/40/40"} 
                            alt={stock.company.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-foreground">{stock.company.name}</div>
                            <div className="text-sm text-muted-foreground">{stock.shares} adet • {stock.company.symbol}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={parseFloat(stock.company.dividend) > 0 ? "default" : "secondary"} className="text-xs">
                                {parseFloat(stock.company.dividend) > 0 ? `%${stock.company.dividend} temettü` : "Temettü yok"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-medium text-foreground">
                            ₺{currentValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className={`flex items-center gap-1 text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {priceChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {Math.abs(priceChange).toFixed(2)}%
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openTradeDialog(stock.company, "sell")}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MinusCircle className="h-3 w-3 mr-1" />
                            Sat
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {portfolio?.stocks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Henüz hisse senedi yok</p>
                    <p className="text-sm">Aşağıdaki şirketlerden hisse satın alarak portföyünüzü oluşturun</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Stocks */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Piyasa Şirketleri
              </CardTitle>
              <p className="text-sm text-muted-foreground">Yatırım için mevcut hisse senetleri</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companies?.map((company) => {
                  const priceChange = getPriceChange(company);
                  const ownedShares = getOwnedShares(company.id);
                  return (
                    <div key={company.id} className="group p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <img 
                            src={company.logoUrl || "/api/placeholder/48/48"} 
                            alt={company.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-grow">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-foreground flex items-center gap-2">
                                  {company.name}
                                  <Badge variant="outline" className="text-xs">{company.symbol}</Badge>
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">{company.description}</p>
                                {ownedShares > 0 && (
                                  <Badge variant="secondary" className="mt-2 text-xs">
                                    {ownedShares} adet sahip
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-red-600">Alış: ₺{parseFloat(company.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {Math.abs(priceChange).toFixed(1)}%
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="text-green-600">Satış: ₺{parseFloat(company.sellPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              onClick={() => openTradeDialog(company, "buy")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <PlusCircle className="h-3 w-3 mr-1" />
                              Al
                            </Button>
                            {ownedShares > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openTradeDialog(company, "sell")}
                              >
                                <MinusCircle className="h-3 w-3 mr-1" />
                                Sat
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trading Dialog */}
      <Dialog open={isTradeDialogOpen} onOpenChange={setIsTradeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {tradeType === "buy" ? "Hisse Senedi Al" : "Hisse Senedi Sat"}
            </DialogTitle>
            <DialogDescription>
              {selectedStock && (
                <>
                  {selectedStock.name} ({selectedStock.symbol}) - 
                  {tradeType === "buy" 
                    ? ` ₺${parseFloat(selectedStock.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} alış fiyatı`
                    : ` ₺${parseFloat(selectedStock.sellPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} satış fiyatı`
                  }
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedStock && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span>Mevcut nakit:</span>
                  <span className="font-medium">₺{portfolio ? parseFloat(portfolio.team.cashBalance).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}</span>
                </div>
                {tradeType === "sell" && (
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span>Sahip olunan:</span>
                    <span className="font-medium">{getOwnedShares(selectedStock.id)} adet</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="shares">Hisse Adedi</Label>
              <Input
                id="shares"
                type="number"
                placeholder="0"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                min="1"
                max={tradeType === "sell" && selectedStock ? getOwnedShares(selectedStock.id) : undefined}
              />
            </div>
            
            {selectedStock && tradeAmount && (
              <Alert>
                <AlertDescription>
                  Toplam tutar: ₺{(
                    parseInt(tradeAmount || "0") * parseFloat(tradeType === "buy" ? selectedStock.price : selectedStock.sellPrice)
                  ).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsTradeDialogOpen(false)}>
                İptal
              </Button>
              <Button 
                onClick={handleTrade} 
                disabled={!tradeAmount || tradeMutation.isPending}
                className={tradeType === "buy" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {tradeMutation.isPending ? "İşlem yapılıyor..." : (tradeType === "buy" ? "Al" : "Sat")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
