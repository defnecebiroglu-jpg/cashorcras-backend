import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, ShoppingCart, Banknote } from "lucide-react";
import type { Company, TeamPortfolio } from "@shared/schema";


interface StockMarketDeskProps {
  teamId: number;
}

export function StockMarketDesk({ teamId }: StockMarketDeskProps) {
  const [buyAmount, setBuyAmount] = useState<{ [key: number]: number }>({});
  const [sellAmount, setSellAmount] = useState<{ [key: number]: number }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const buyStockMutation = useMutation({
    mutationFn: async ({ companyId, shares }: { companyId: number; shares: number }) => {
      const response = await fetch(`/api/teams/${teamId}/stocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, shares })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to buy stock");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", teamId, "portfolio"] });
      toast({
        title: "Başarılı!",
        description: "Hisse senedi satın alındı.",
      });
      setBuyAmount({});
    },
    onError: (error: any) => {
      toast({
        title: "Hata!",
        description: error.message || "Hisse senedi satın alınamadı.",
        variant: "destructive",
      });
    },
  });

  const sellStockMutation = useMutation({
    mutationFn: async ({ companyId, shares }: { companyId: number; shares: number }) => {
      const response = await fetch(`/api/teams/${teamId}/stocks/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, shares })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sell stock");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", teamId, "portfolio"] });
      toast({
        title: "Başarılı!",
        description: "Hisse senedi satıldı.",
      });
      setSellAmount({});
    },
    onError: (error: any) => {
      toast({
        title: "Hata!",
        description: error.message || "Hisse senedi satılamadı.",
        variant: "destructive",
      });
    },
  });

  const handleBuyStock = (companyId: number) => {
    const shares = buyAmount[companyId];
    if (!shares || shares <= 0) {
      toast({
        title: "Hata!",
        description: "Geçerli bir adet giriniz.",
        variant: "destructive",
      });
      return;
    }
    buyStockMutation.mutate({ companyId, shares });
  };

  const handleSellStock = (companyId: number) => {
    const shares = sellAmount[companyId];
    if (!shares || shares <= 0) {
      toast({
        title: "Hata!",
        description: "Geçerli bir adet giriniz.",
        variant: "destructive",
      });
      return;
    }
    sellStockMutation.mutate({ companyId, shares });
  };

  const calculateSpread = (buyPrice: string, sellPrice: string) => {
    const spread = parseFloat(buyPrice) - parseFloat(sellPrice);
    const spreadPercent = (spread / parseFloat(buyPrice)) * 100;
    return { spread, spreadPercent };
  };

  if (portfolioLoading || companiesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Borsa verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Team's Stock Portfolio */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Hisse Senedi Portföyünüz
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Mevcut varlıklar ve güncel piyasa değeri
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolio?.stocks.map((stock) => {
                const currentValue = parseFloat(stock.company.sellPrice) * stock.shares;
                const { spread, spreadPercent } = calculateSpread(stock.company.price, stock.company.sellPrice);
                const ownedStock = portfolio.stocks.find(s => s.company.id === stock.company.id);
                
                return (
                  <div key={stock.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={stock.company.logoUrl || "/api/placeholder/40/40"} 
                          alt={stock.company.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{stock.company.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {stock.shares} adet • {stock.company.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ₺{currentValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Satış fiyatı: ₺{parseFloat(stock.company.sellPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Sell Interface */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <Input
                        type="number"
                        placeholder="Satılacak adet"
                        value={sellAmount[stock.company.id] || ""}
                        onChange={(e) => setSellAmount(prev => ({
                          ...prev,
                          [stock.company.id]: parseInt(e.target.value) || 0
                        }))}
                        min={1}
                        max={stock.shares}
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleSellStock(stock.company.id)}
                        disabled={sellStockMutation.isPending || !sellAmount[stock.company.id]}
                        variant="destructive"
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        {sellStockMutation.isPending ? "Satılıyor..." : "Sat"}
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {portfolio?.stocks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Henüz hisse senedi yok</p>
                  <p className="text-sm">Aşağıdan hisse senedi satın alabilirsiniz</p>
                </div>
              )}
              
              <Separator />
              <div className="flex justify-between items-center pt-4">
                <span className="font-medium">Toplam Hisse Değeri:</span>
                <span className="font-bold text-lg">
                  ₺{portfolio ? parseFloat(portfolio.totalStockValue).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Nakit Bakiye:</span>
                <span>₺{portfolio ? parseFloat(portfolio.team.cashBalance).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}</span>
              </div>
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
              Borsa İstanbul (BIST)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Anlık fiyatlar ve alım satım işlemleri
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companies?.map((company) => {
                const { spread, spreadPercent } = calculateSpread(company.price, company.sellPrice);
                const ownedStock = portfolio?.stocks.find(s => s.company.id === company.id);
                
                return (
                  <div key={company.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={company.logoUrl || "/api/placeholder/48/48"} 
                        alt={company.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{company.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {company.symbol}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{company.description}</p>
                            {parseFloat(company.dividend) > 0 && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                %{company.dividend} temettü
                              </Badge>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-red-500" />
                                <span className="text-sm font-medium text-red-600">
                                  Alış: ₺{parseFloat(company.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingDown className="h-3 w-3 text-green-500" />
                                <span className="text-sm font-medium text-green-600">
                                  Satış: ₺{parseFloat(company.sellPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Spread: ₺{spread.toFixed(2)} ({spreadPercent.toFixed(1)}%)
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Owned shares info */}
                        {ownedStock && (
                          <div className="bg-muted/50 p-2 rounded-md mb-3">
                            <div className="text-sm">
                              <span className="font-medium">Portföyünüzde:</span> {ownedStock.shares} adet
                              <span className="text-muted-foreground ml-2">
                                (₺{(parseFloat(company.sellPrice) * ownedStock.shares).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Buy Interface */}
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Adet"
                            value={buyAmount[company.id] || ""}
                            onChange={(e) => setBuyAmount(prev => ({
                              ...prev,
                              [company.id]: parseInt(e.target.value) || 0
                            }))}
                            min={1}
                            className="flex-1"
                          />
                          <div className="text-sm text-muted-foreground whitespace-nowrap">
                            Toplam: ₺{buyAmount[company.id] ? 
                              (parseFloat(company.price) * buyAmount[company.id]).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                              "0,00"}
                          </div>
                          <Button
                            onClick={() => handleBuyStock(company.id)}
                            disabled={buyStockMutation.isPending || !buyAmount[company.id]}
                            size="sm"
                            className="whitespace-nowrap"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {buyStockMutation.isPending ? "Alınıyor..." : "Satın Al"}
                          </Button>
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
  );
}
