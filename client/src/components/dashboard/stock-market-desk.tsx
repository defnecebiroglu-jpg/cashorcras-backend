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
    return <div className="flex items-center justify-center h-64 text-[#e3dfd6]">Yükleniyor...</div>;
  }

  return (
    <div 
      className="min-h-screen p-8" 
      style={{ backgroundColor: '#1b1b1b' }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="[font-family:'Bowlby_One',Helvetica] font-normal text-6xl mb-4 leading-tight"
            style={{ color: '#e3dfd6' }}
          >
            BORSA MASASİ
          </h1>
          <p 
            className="[font-family:'Inter',Helvetica] text-xl"
            style={{ color: '#e3dfd6' }}
          >
            Hisse senedi portföyünüz ve piyasa durumu
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team's Stock Portfolio */}
          <Card 
            className="border-none rounded-[25px] shadow-2xl"
            style={{ backgroundColor: '#cae304e6' }}
          >
            <CardHeader className="pb-6">
              <CardTitle 
                className="[font-family:'Bowlby_One',Helvetica] font-normal text-3xl"
                style={{ color: '#1b1b1b' }}
              >
                Hisse Senedi Portföyünüz
              </CardTitle>
              <p 
                className="[font-family:'Inter',Helvetica] text-lg"
                style={{ color: '#1b1b1b' }}
              >
                Mevcut varlıklar ve performans
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-6">
                {portfolio?.stocks.map((stock) => (
                  <div 
                    key={stock.id} 
                    className="flex items-center justify-between py-4 px-6 rounded-lg border-2"
                    style={{ 
                      backgroundColor: '#1b1b1b',
                      borderColor: '#aa95c7'
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <img 
                        src={stock.company.logoUrl || "/api/placeholder/50/50"} 
                        alt={stock.company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div 
                          className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg"
                          style={{ color: '#e3dfd6' }}
                        >
                          {stock.company.name}
                        </div>
                        <div 
                          className="[font-family:'Inter',Helvetica] text-sm"
                          style={{ color: '#e3dfd6' }}
                        >
                          {stock.shares} adet hisse
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div 
                        className="[font-family:'Bowlby_One',Helvetica] font-normal text-xl"
                        style={{ color: '#cae304' }}
                      >
                        ₺{(parseFloat(stock.company.price) * stock.shares).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div 
                        className="[font-family:'Inter',Helvetica] text-sm"
                        style={{ color: parseFloat(stock.company.dividend) > 0 ? '#cae304' : '#aa95c7' }}
                      >
                        {parseFloat(stock.company.dividend) > 0 ? `%${stock.company.dividend} temettü` : "Temettü yok"}
                      </div>
                    </div>
                  </div>
                ))}
                
                {portfolio?.stocks.length === 0 && (
                  <div 
                    className="text-center py-12 rounded-lg"
                    style={{ backgroundColor: '#1b1b1b' }}
                  >
                    <p 
                      className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl mb-2"
                      style={{ color: '#e3dfd6' }}
                    >
                      Henüz hisse senedi yok
                    </p>
                    <p 
                      className="[font-family:'Inter',Helvetica] text-lg"
                      style={{ color: '#aa95c7' }}
                    >
                      Aşağıdaki şirketlerden hisse satın alın
                    </p>
                  </div>
                )}
                
                <div 
                  className="flex justify-between items-center pt-6 border-t-2"
                  style={{ borderColor: '#1b1b1b' }}
                >
                  <span 
                    className="[font-family:'Bowlby_One',Helvetica] font-normal text-xl"
                    style={{ color: '#1b1b1b' }}
                  >
                    Toplam Hisse Değeri:
                  </span>
                  <span 
                    className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl"
                    style={{ color: '#1b1b1b' }}
                  >
                    ₺{portfolio ? parseFloat(portfolio.totalStockValue).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Stocks */}
          <Card 
            className="border-none rounded-[25px] shadow-2xl"
            style={{ backgroundColor: '#aa95c7' }}
          >
            <CardHeader className="pb-6">
              <CardTitle 
                className="[font-family:'Bowlby_One',Helvetica] font-normal text-3xl"
                style={{ color: '#1b1b1b' }}
              >
                Piyasa Şirketleri
              </CardTitle>
              <p 
                className="[font-family:'Inter',Helvetica] text-lg"
                style={{ color: '#1b1b1b' }}
              >
                Yatırım için mevcut hisse senetleri
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-6">
                {companies?.map((company) => (
                  <div 
                    key={company.id} 
                    className="p-6 rounded-lg border-2 hover:shadow-lg transition-all duration-300"
                    style={{ 
                      backgroundColor: '#1b1b1b',
                      borderColor: '#cae304'
                    }}
                  >
                    <div className="flex items-start space-x-4">
                      <img 
                        src={company.logoUrl || "/api/placeholder/60/60"} 
                        alt={company.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 
                              className="[font-family:'Bowlby_One',Helvetica] font-normal text-xl mb-2"
                              style={{ color: '#e3dfd6' }}
                            >
                              {company.name}
                            </h3>
                            <p 
                              className="[font-family:'Inter',Helvetica] text-sm mb-3"
                              style={{ color: '#e3dfd6' }}
                            >
                              {company.description}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="space-y-2">
                              <div 
                                className="[font-family:'Inter',Helvetica] font-semibold text-lg"
                                style={{ color: '#cae304' }}
                              >
                                Alış: ₺{parseFloat(company.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div 
                                className="[font-family:'Inter',Helvetica] font-semibold text-lg"
                                style={{ color: '#aa95c7' }}
                              >
                                Satış: ₺{parseFloat(company.sellPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
