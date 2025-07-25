import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Company, TeamPortfolio } from "@shared/schema";

interface StockMarketDeskProps {
  teamId: number;
}

export function StockMarketDesk({ teamId }: StockMarketDeskProps) {
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

  if (portfolioLoading || companiesLoading) {
    return (
      <div 
        className="flex items-center justify-center h-64"
        style={{ 
          backgroundColor: '#1b1b1b',
          color: '#e3dfd6'
        }}
      >
        <div className="[font-family:'Inter',Helvetica] text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-8"
      style={{ backgroundColor: '#1b1b1b' }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="[font-family:'Bowlby_One',Helvetica] font-normal text-5xl mb-4"
            style={{ color: '#e3dfd6' }}
          >
            BORSA MASASİ
          </h1>
          <p 
            className="[font-family:'Inter',Helvetica] text-lg"
            style={{ color: '#e3dfd6' }}
          >
            Hisse senedi portföyünüz ve piyasa durumu
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team's Stock Portfolio */}
          <div 
            className="rounded-[25px] p-8"
            style={{ backgroundColor: '#cae304e6' }}
          >
            <h2 
              className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl mb-6"
              style={{ color: '#1b1b1b' }}
            >
              Hisse Senedi Portföyünüz
            </h2>
            <div className="space-y-4">
              {portfolio?.stocks.map((stock) => (
                <div 
                  key={stock.id} 
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: '#1b1b1b' }}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={stock.company.logoUrl || "/api/placeholder/40/40"} 
                      alt={stock.company.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <div 
                        className="[font-family:'Bowlby_One',Helvetica] font-normal"
                        style={{ color: '#e3dfd6' }}
                      >
                        {stock.company.name}
                      </div>
                      <div 
                        className="[font-family:'Inter',Helvetica] text-sm"
                        style={{ color: '#e3dfd6' }}
                      >
                        {stock.shares} adet
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div 
                      className="[font-family:'Bowlby_One',Helvetica] font-normal"
                      style={{ color: '#cae304' }}
                    >
                      ₺{(parseFloat(stock.company.sellPrice) * stock.shares).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div 
                      className="[font-family:'Inter',Helvetica] text-sm"
                      style={{ color: '#aa95c7' }}
                    >
                      {parseFloat(stock.company.dividend) > 0 ? `%${stock.company.dividend} temettü` : "Temettü yok"}
                    </div>
                  </div>
                </div>
              ))}
              
              {portfolio?.stocks.length === 0 && (
                <div 
                  className="text-center py-8 rounded-lg"
                  style={{ backgroundColor: '#1b1b1b' }}
                >
                  <p 
                    className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg"
                    style={{ color: '#e3dfd6' }}
                  >
                    Henüz hisse senedi yok
                  </p>
                </div>
              )}
              
              <div 
                className="flex justify-between items-center pt-4 border-t-2"
                style={{ borderColor: '#1b1b1b' }}
              >
                <span 
                  className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg"
                  style={{ color: '#1b1b1b' }}
                >
                  Toplam Değer:
                </span>
                <span 
                  className="[font-family:'Bowlby_One',Helvetica] font-normal text-xl"
                  style={{ color: '#1b1b1b' }}
                >
                  ₺{portfolio ? parseFloat(portfolio.totalStockValue).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}
                </span>
              </div>
            </div>
          </div>

          {/* Available Stocks */}
          <div 
            className="rounded-[25px] p-8"
            style={{ backgroundColor: '#aa95c7' }}
          >
            <h2 
              className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl mb-6"
              style={{ color: '#1b1b1b' }}
            >
              Piyasa Şirketleri
            </h2>
            <div className="space-y-4">
              {companies?.map((company) => (
                <div 
                  key={company.id} 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#1b1b1b' }}
                >
                  <div className="flex items-start space-x-3">
                    <img 
                      src={company.logoUrl || "/api/placeholder/40/40"} 
                      alt={company.name}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 
                            className="[font-family:'Bowlby_One',Helvetica] font-normal"
                            style={{ color: '#e3dfd6' }}
                          >
                            {company.name}
                          </h3>
                          <p 
                            className="[font-family:'Inter',Helvetica] text-sm mt-1"
                            style={{ color: '#e3dfd6' }}
                          >
                            {company.description}
                          </p>
                        </div>
                        <div className="text-right text-sm ml-4">
                          <div 
                            className="[font-family:'Inter',Helvetica] font-semibold"
                            style={{ color: '#cae304' }}
                          >
                            Alış: ₺{parseFloat(company.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div 
                            className="[font-family:'Inter',Helvetica] font-semibold"
                            style={{ color: '#aa95c7' }}
                          >
                            Satış: ₺{parseFloat(company.sellPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
