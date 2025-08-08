import { useQuery } from "@tanstack/react-query";

interface TeamPortfolioResponse {
  team: {
    id: number;
    name: string;
    cashBalance: string;
    accessCode: string;
    profilePicUrl: string | null;
  };
  stocks: Array<{
    company: {
      id: number;
      name: string;
      price: string;
      logoUrl: string | null;
    };
    shares: number;
  }>;
  currencies: Array<{
    currency: {
      id: number;
      name: string;
      code: string;
      rate: string;
      sellRate: string;
      logoUrl: string | null;
    };
    amount: string;
  }>;
  startup: {
    id: number;
    name: string;
    description: string;
    value: string;
    industry: string;
    riskLevel: string;
  } | null;
  totalStockValue: string;
  totalCurrencyValue: string;
  totalPortfolioValue: string;
}

interface StartupTradingDeskProps {
  onTabChange?: (tab: "stock" | "currency" | "startup") => void;
}

export default function StartupTradingDesk({ onTabChange }: StartupTradingDeskProps) {
  const teamId = localStorage.getItem("teamId");
  const { data: portfolio, isLoading: portfolioLoading } = useQuery<TeamPortfolioResponse>({
    queryKey: [`/api/teams/${teamId}/portfolio`],
    enabled: !!teamId,
  });

  if (portfolioLoading) {
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
      <div className="p-6 min-h-full">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
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
              className="px-6 py-2 rounded-lg [font-family:'Bowlby_One',Helvetica] font-normal bg-[#aa95c7]"
              style={{ backgroundColor: '#aa95c7', color: '#1b1b1b' }}
              onClick={() => window.location.href = '/'}
            >ÇIKIS</button>
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
                ₺{portfolio?.team?.cashBalance ? Math.round(parseFloat(portfolio.team.cashBalance)).toLocaleString() : "0"}
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
                ₺{portfolio?.totalPortfolioValue ? Math.round(parseFloat(portfolio.totalPortfolioValue)) : "0"}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-6 mb-8">
            <div 
              className="px-6 py-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: '#e3dfd6'
              }}
              onClick={() => onTabChange?.("stock")}
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
              className="px-6 py-3 rounded-lg border-b-4 cursor-pointer"
              style={{ 
                backgroundColor: '#cae304',
                borderColor: '#aa95c7',
                color: '#1b1b1b'
              }}
            >
              <span className="[font-family:'Bowlby_One',Helvetica] font-normal">GİRİŞİM MASASI</span>
            </div>
          </div>

          {/* Main Content - Startup Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Startup Investment Section */}
            <div 
              className="p-4 rounded-lg border-4 h-fit"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderColor: '#cae304'
              }}
            >
              <h2 
                className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl mb-2"
                style={{ color: '#e3dfd6' }}
              >
                Girişim Yatırımı
              </h2>
              <p 
                className="[font-family:'Inter',Helvetica] text-sm mb-6"
                style={{ color: '#e3dfd6' }}
              >
                Atanan Startup Projesi
              </p>

              {!portfolio?.startup ? (
                <div className="text-center py-12">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: '#aa95c7' }}
                  >
                    <svg 
                      className="w-8 h-8" 
                      style={{ color: '#1b1b1b' }}
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L13.09 8.26L19 7L17.74 13.09L24 12L17.74 10.91L19 17L13.09 15.74L12 22L10.91 15.74L5 17L6.26 10.91L0 12L6.26 13.09L5 7L10.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <h3 
                    className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg mb-2"
                    style={{ color: '#e3dfd6' }}
                  >
                    Girişim Ataması Bekleniyor
                  </h3>
                  <p 
                    className="[font-family:'Inter',Helvetica] text-sm"
                    style={{ color: '#aa95c7' }}
                  >
                    Bu takıma henüz bir girişim projesi atanmamış
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 
                    className="[font-family:'Bowlby_One',Helvetica] font-normal text-xl mb-4"
                    style={{ color: '#cae304' }}
                  >
                    {portfolio.startup.name}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div 
                      className="rounded-lg p-3 text-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    >
                      <div 
                        className="[font-family:'Inter',Helvetica] text-xs mb-1"
                        style={{ color: '#aa95c7' }}
                      >
                        Değer
                      </div>
                      <div 
                        className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg"
                        style={{ color: '#cae304' }}
                      >
                        ₺{parseFloat(portfolio.startup.value).toLocaleString()}
                      </div>
                    </div>
                    
                    <div 
                      className="rounded-lg p-3 text-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    >
                      <div 
                        className="[font-family:'Inter',Helvetica] text-xs mb-1"
                        style={{ color: '#aa95c7' }}
                      >
                        Sektör
                      </div>
                      <div 
                        className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg"
                        style={{ color: '#e3dfd6' }}
                      >
                        {portfolio.startup.industry}
                      </div>
                    </div>
                    
                    <div 
                      className="rounded-lg p-3 text-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    >
                      <div 
                        className="[font-family:'Inter',Helvetica] text-xs mb-1"
                        style={{ color: '#aa95c7' }}
                      >
                        Risk
                      </div>
                      <div 
                        className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg"
                        style={{ 
                          color: portfolio.startup.riskLevel === 'Yüksek' ? '#ff6b6b' : 
                                 portfolio.startup.riskLevel === 'Orta' ? '#feca57' : '#48dbfb'
                        }}
                      >
                        {portfolio.startup.riskLevel}
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="rounded-lg p-4 mb-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                  >
                    <h4 
                      className="[font-family:'Bowlby_One',Helvetica] font-normal text-sm mb-2"
                      style={{ color: '#cae304' }}
                    >
                      Açıklama
                    </h4>
                    <p 
                      className="[font-family:'Inter',Helvetica] text-sm leading-relaxed"
                      style={{ color: '#e3dfd6' }}
                    >
                      {portfolio.startup.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Portfolio Summary Section */}
            <div 
              className="p-4 rounded-lg border-4 h-fit"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderColor: '#aa95c7'
              }}
            >
              <h2 
                className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl mb-2"
                style={{ color: '#e3dfd6' }}
              >
                Portföy Özeti
              </h2>
              <p 
                className="[font-family:'Inter',Helvetica] text-sm mb-6"
                style={{ color: '#e3dfd6' }}
              >
                Tüm Yatırımlarınız
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span 
                    className="[font-family:'Inter',Helvetica] text-sm"
                    style={{ color: '#e3dfd6' }}
                  >
                    Nakit Bakiye
                  </span>
                  <span 
                    className="[font-family:'Bowlby_One',Helvetica] font-normal"
                    style={{ color: '#cae304' }}
                  >
                    ₺{portfolio?.team?.cashBalance ? Math.round(parseFloat(portfolio.team.cashBalance)).toLocaleString() : "0"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span 
                    className="[font-family:'Inter',Helvetica] text-sm"
                    style={{ color: '#e3dfd6' }}
                  >
                    Hisse Değeri
                  </span>
                  <span 
                    className="[font-family:'Bowlby_One',Helvetica] font-normal"
                    style={{ color: '#e3dfd6' }}
                  >
                    ₺{portfolio?.totalStockValue ? Math.round(parseFloat(portfolio.totalStockValue)).toLocaleString() : "0"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span 
                    className="[font-family:'Inter',Helvetica] text-sm"
                    style={{ color: '#e3dfd6' }}
                  >
                    Döviz Değeri
                  </span>
                  <span 
                    className="[font-family:'Bowlby_One',Helvetica] font-normal"
                    style={{ color: '#e3dfd6' }}
                  >
                    ₺{portfolio?.totalCurrencyValue ? Math.round(parseFloat(portfolio.totalCurrencyValue)).toLocaleString() : "0"}
                  </span>
                </div>

                <div 
                  className="border-t pt-4"
                  style={{ borderColor: '#aa95c7' }}
                >
                  <div className="flex justify-between items-center">
                    <span 
                      className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg"
                      style={{ color: '#cae304' }}
                    >
                      Toplam
                    </span>
                    <span 
                      className="[font-family:'Bowlby_One',Helvetica] font-normal text-lg"
                      style={{ color: '#cae304' }}
                    >
                      ₺{portfolio?.totalPortfolioValue ? Math.round(parseFloat(portfolio.totalPortfolioValue)).toLocaleString() : "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}