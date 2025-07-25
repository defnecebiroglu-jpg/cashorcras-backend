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
      className="min-h-screen p-6"
      style={{ backgroundColor: '#1b1b1b' }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Team Name and Exit Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#cae304' }}
            >
              <span 
                className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg"
                style={{ color: '#1b1b1b' }}
              >
                T
              </span>
            </div>
            <span 
              className="[font-family:'Bowlby_One',Helvetica] font-normal text-xl"
              style={{ color: '#e3dfd6' }}
            >
              TAKIM 1
            </span>
          </div>
          <button 
            className="px-6 py-2 rounded-lg [font-family:'Bowlby_One',Helvetica] font-normal"
            style={{ backgroundColor: '#aa95c7', color: '#1b1b1b' }}
          >
            ÇIKIŞ
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            className="p-6 rounded-lg border-2 border-dashed"
            style={{ borderColor: '#cae304' }}
          >
            <div 
              className="[font-family:'Bowlby_One',Helvetica] font-normal text-4xl mb-2"
              style={{ color: '#e3dfd6' }}
            >
              ₺{portfolio ? parseFloat(portfolio.team.cashBalance).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "0"}
            </div>
            <div 
              className="[font-family:'Inter',Helvetica] text-lg"
              style={{ color: '#e3dfd6' }}
            >
              Nakit Bakiye
            </div>
          </div>
          <div 
            className="p-6 rounded-lg border-2 border-dashed"
            style={{ borderColor: '#aa95c7' }}
          >
            <div 
              className="[font-family:'Bowlby_One',Helvetica] font-normal text-4xl mb-2"
              style={{ color: '#e3dfd6' }}
            >
              ₺{portfolio ? parseFloat(portfolio.totalPortfolioValue).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "0"}
            </div>
            <div 
              className="[font-family:'Inter',Helvetica] text-lg"
              style={{ color: '#e3dfd6' }}
            >
              Toplam Portföy
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-8 mb-6">
          <button 
            className="flex items-center space-x-2 pb-2 border-b-2"
            style={{ borderColor: '#cae304', color: '#e3dfd6' }}
          >
            <span>$</span>
            <span className="[font-family:'Inter',Helvetica]">Döviz Masası</span>
          </button>
          <button 
            className="flex items-center space-x-2 pb-2 border-b-2"
            style={{ borderColor: '#cae304', color: '#e3dfd6' }}
          >
            <span>📈</span>
            <span className="[font-family:'Inter',Helvetica]">Girişim Masası</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stock Portfolio Section */}
          <div 
            className="p-6 rounded-lg border-2"
            style={{ borderColor: '#cae304', backgroundColor: 'rgba(0,0,0,0.2)' }}
          >
            <h2 
              className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl mb-2"
              style={{ color: '#e3dfd6' }}
            >
              Hisse Senedi Portföyü
            </h2>
            <p 
              className="[font-family:'Inter',Helvetica] text-sm mb-6"
              style={{ color: '#e3dfd6' }}
            >
              Mevcut Varlık Ve Performans
            </p>

            <div className="space-y-4">
              {portfolio?.stocks.map((stock) => (
                <div key={stock.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded"
                      style={{ backgroundColor: '#e3dfd6' }}
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
                        {stock.shares} Adet Hisse
                      </div>
                    </div>
                  </div>
                  <div 
                    className="px-4 py-2 rounded [font-family:'Bowlby_One',Helvetica] font-normal"
                    style={{ backgroundColor: '#aa95c7', color: '#1b1b1b' }}
                  >
                    ₺{Math.round(parseFloat(stock.company.sellPrice) * stock.shares)}
                  </div>
                </div>
              ))}

              {portfolio?.stocks.length === 0 && (
                <div className="text-center py-8">
                  <p 
                    className="[font-family:'Inter',Helvetica]"
                    style={{ color: '#e3dfd6' }}
                  >
                    Henüz hisse senedi yok
                  </p>
                </div>
              )}

              <div 
                className="flex justify-between items-center pt-4 border-t"
                style={{ borderColor: '#e3dfd6' }}
              >
                <span 
                  className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg"
                  style={{ color: '#e3dfd6' }}
                >
                  Toplam Hisse Değeri:
                </span>
                <span 
                  className="[font-family:'Bowlby_One',Helvetica] font-normal text-xl"
                  style={{ color: '#cae304' }}
                >
                  ₺{portfolio ? Math.round(parseFloat(portfolio.totalStockValue)) : "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Market Companies Section */}
          <div 
            className="p-6 rounded-lg"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          >
            <h2 
              className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl mb-2"
              style={{ color: '#e3dfd6' }}
            >
              Piyasa Şirketleri
            </h2>
            <p 
              className="[font-family:'Inter',Helvetica] text-sm mb-6"
              style={{ color: '#e3dfd6' }}
            >
              Yatırım İçin Mevcut Hisse Senetleri
            </p>

            <div className="space-y-4">
              {companies?.slice(0, 3).map((company) => (
                <div key={company.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div 
                        className="w-12 h-12 rounded"
                        style={{ backgroundColor: '#e3dfd6' }}
                      />
                      <div>
                        <div 
                          className="[font-family:'Bowlby_One',Helvetica] font-normal"
                          style={{ color: '#e3dfd6' }}
                        >
                          {company.name}
                        </div>
                        <p 
                          className="[font-family:'Inter',Helvetica] text-sm mt-1"
                          style={{ color: '#e3dfd6' }}
                        >
                          {company.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span 
                        className="[font-family:'Inter',Helvetica] text-sm"
                        style={{ color: '#e3dfd6' }}
                      >
                        Alış
                      </span>
                      <span 
                        className="[font-family:'Inter',Helvetica] text-sm"
                        style={{ color: '#e3dfd6' }}
                      >
                        Satış
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <div 
                      className="px-4 py-2 rounded [font-family:'Bowlby_One',Helvetica] font-normal"
                      style={{ backgroundColor: '#aa95c7', color: '#1b1b1b' }}
                    >
                      {Math.round(parseFloat(company.price))}
                    </div>
                    <div 
                      className="px-4 py-2 rounded [font-family:'Bowlby_One',Helvetica] font-normal"
                      style={{ backgroundColor: '#cae304', color: '#1b1b1b' }}
                    >
                      {Math.round(parseFloat(company.sellPrice))}
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
