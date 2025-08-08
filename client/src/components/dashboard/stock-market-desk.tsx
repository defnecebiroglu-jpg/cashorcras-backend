import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Company, TeamPortfolio } from "@shared/schema";

interface StockMarketDeskProps {
  teamId: number;
  onTabChange?: (tab: "stocks" | "currency" | "startup") => void;
}

export function StockMarketDesk({ teamId, onTabChange }: StockMarketDeskProps) {
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
        className="fixed inset-0 flex items-center justify-center z-50"
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
      className="fixed inset-0 overflow-y-auto z-50"
      style={{ backgroundColor: '#1b1b1b' }}
    >
      <div className="p-6">
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
                {portfolio?.team?.name || "TAKIM 1"}
              </span>
            </div>
            <button 
              className="px-6 py-2 rounded-lg [font-family:'Bowlby_One',Helvetica] font-normal"
              style={{ backgroundColor: '#aa95c7', color: '#1b1b1b' }}
              onClick={() => window.location.href = '/'}
            >
              ÇIKIŞ
            </button>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div 
              className="p-6 rounded-lg border-2 border-dashed"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderColor: '#e3dfd6'
              }}
            >
              <h3 
                className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg mb-2 text-[#e3dfd6]"
                style={{ color: '#e3dfd6' }}
              >NAKIT BAKIYE</h3>
              <p 
                className="[font-family:'Inter',Helvetica] text-3xl font-bold"
                style={{ color: '#cae304' }}
              >
                ₺{portfolio ? Math.round(parseFloat(portfolio.team.cashBalance)) : "0"}
              </p>
            </div>
            
            <div 
              className="p-6 rounded-lg border-2 border-dashed"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderColor: '#e3dfd6'
              }}
            >
              <h3 
                className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg mb-2"
                style={{ color: '#e3dfd6' }}
              >
                TOPLAM PORTFÖY
              </h3>
              <p 
                className="[font-family:'Inter',Helvetica] text-3xl font-bold"
                style={{ color: '#cae304' }}
              >
                ₺{portfolio ? Math.round(parseFloat(portfolio.totalPortfolioValue)) : "0"}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-6 mb-8">
            <div 
              className="px-6 py-3 rounded-lg border-b-4 cursor-pointer"
              style={{ 
                backgroundColor: '#cae304',
                borderColor: '#cae304',
                color: '#1b1b1b'
              }}
            >
              <span className="[font-family:'Bowlby_One',Helvetica] font-normal">BORSA MASASI</span>
            </div>
            <div 
              className="px-6 py-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: '#e3dfd6'
              }}
              onClick={() => onTabChange?.("currency")}
            >
              <span className="[font-family:'Bowlby_One',Helvetica] font-normal">DÖVIZ MASASI</span>
            </div>
            <div 
              className="px-6 py-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: '#e3dfd6'
              }}
              onClick={() => onTabChange?.("startup")}
            >
              <span className="[font-family:'Bowlby_One',Helvetica] font-normal">GIRISIM MASASI</span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Stock Portfolio Section */}
            <div 
              className="p-6 rounded-lg border-2"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderColor: '#cae304'
              }}
            >
              <h2 
                className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl mb-2"
                style={{ color: '#e3dfd6' }}
              >
                Hisse Portföyü
              </h2>
              <p 
                className="[font-family:'Inter',Helvetica] text-sm mb-6"
                style={{ color: '#e3dfd6' }}
              >
                Sahip Olduğunuz Hisse Senetleri
              </p>

              <div className="space-y-4 mb-6">
                {portfolio?.stocks && portfolio.stocks.length > 0 ? (
                  portfolio.stocks.map((stock, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded"
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
                            {stock.shares} adet
                          </div>
                        </div>
                      </div>
                      <div 
                        className="px-3 py-1 rounded [font-family:'Bowlby_One',Helvetica] font-normal"
                        style={{ backgroundColor: '#aa95c7', color: '#1b1b1b' }}
                      >
                        ₺{Math.round(parseFloat(stock.company.price))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div 
                    className="text-center py-8 [font-family:'Inter',Helvetica]"
                    style={{ color: '#e3dfd6' }}
                  >
                    Henüz hisse senedi satın almadınız
                  </div>
                )}
              </div>

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

            {/* Market Companies Section */}
            <div 
              className="p-6 rounded-lg border-2"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderColor: '#aa95c7'
              }}
            >
              <h2 
                className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl mb-2 text-[#e3dfd6]"
                style={{ color: '#e3dfd6' }}
              >Piyasa Sirketleri</h2>
              <p 
                className="[font-family:'Inter',Helvetica] text-sm mb-6"
                style={{ color: '#e3dfd6' }}
              >
                Yatırım İçin Mevcut Hisse Senetleri
              </p>

              <div className="space-y-4">
                {companies?.slice(0, 5).map((company) => (
                  <div key={company.id} className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div 
                        className="w-12 h-12 rounded flex-shrink-0"
                        style={{ backgroundColor: '#e3dfd6' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div 
                          className="[font-family:'Bowlby_One',Helvetica] font-normal"
                          style={{ color: '#e3dfd6' }}
                        >
                          {company.name}
                        </div>
                        <p 
                          className="[font-family:'Inter',Helvetica] text-sm mt-1 max-w-xs pr-4"
                          style={{ color: '#e3dfd6' }}
                        >
                          {company.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="[font-family:'Inter',Helvetica] text-sm text-[#e3dfd6] ml-[45px] mr-[45px]"
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
                      <div className="flex space-x-2">
                        <button 
                          className="px-4 py-2 rounded [font-family:'Bowlby_One',Helvetica] font-normal hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: '#aa95c7', color: '#1b1b1b' }}
                          onClick={() => console.log('Buy', company.name)}
                        >
                          ₺{Math.round(parseFloat(company.price))}
                        </button>
                        <button 
                          className="px-4 py-2 rounded [font-family:'Bowlby_One',Helvetica] font-normal hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: '#cae304', color: '#1b1b1b' }}
                          onClick={() => console.log('Sell', company.name)}
                        >
                          ₺{Math.round(parseFloat(company.sellPrice))}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}