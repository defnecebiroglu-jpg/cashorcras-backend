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
      className="fixed inset-0 overflow-y-auto z-50 p-6"
      style={{ backgroundColor: '#1b1b1b' }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 
            className="[font-family:'Bowlby_One',Helvetica] text-4xl font-normal mb-2"
            style={{ color: '#e3dfd6' }}
          >
            GİRİŞİM MASASI
          </h1>
          <p 
            className="[font-family:'Inter',Helvetica] text-lg"
            style={{ color: '#e3dfd6' }}
          >
            Girişim yatırımlarınızı yönetin ve projelerinizi takip edin
          </p>
        </div>

        {/* Team Avatar */}
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor: '#aa95c7', color: '#1b1b1b' }}
        >
          T
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-8 mb-12">
        <button
          onClick={() => onTabChange?.("stock")}
          className="[font-family:'Inter',Helvetica] text-lg px-4 py-2 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: '#e3dfd6' }}
        >
          Borsa Masası
        </button>
        <button
          onClick={() => onTabChange?.("currency")}
          className="[font-family:'Inter',Helvetica] text-lg px-4 py-2 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: '#e3dfd6' }}
        >
          Döviz Masası
        </button>
        <button
          className="[font-family:'Inter',Helvetica] text-lg px-4 py-2 rounded-lg"
          style={{ 
            color: '#cae304',
            backgroundColor: 'rgba(202, 227, 4, 0.2)',
            border: '2px solid #cae304'
          }}
        >
          Girişim Masası
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cash Balance */}
        <div className="lg:col-span-1">
          <div 
            className="rounded-2xl p-6 h-full"
            style={{ backgroundColor: '#2a2a2a' }}
          >
            <h3 
              className="[font-family:'Inter',Helvetica] text-xl font-semibold mb-4"
              style={{ color: '#e3dfd6' }}
            >
              NAKIT BAKIYE
            </h3>
            <p 
              className="[font-family:'Inter',Helvetica] text-3xl font-bold"
              style={{ color: '#cae304' }}
            >
              ₺{portfolio?.team?.cashBalance ? Math.round(parseFloat(portfolio.team.cashBalance)).toLocaleString() : "0"}
            </p>
          </div>
        </div>

        {/* Startup Investment */}
        <div className="lg:col-span-2">
          <div 
            className="rounded-2xl p-6 h-full"
            style={{ backgroundColor: '#2a2a2a' }}
          >
            {!portfolio?.startup ? (
              <div className="text-center py-12">
                <div 
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: '#aa95c7' }}
                >
                  <svg 
                    className="w-12 h-12" 
                    style={{ color: '#1b1b1b' }}
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L13.09 8.26L19 7L17.74 13.09L24 12L17.74 10.91L19 17L13.09 15.74L12 22L10.91 15.74L5 17L6.26 10.91L0 12L6.26 13.09L5 7L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <h3 
                  className="[font-family:'Inter',Helvetica] text-2xl font-bold mb-3"
                  style={{ color: '#e3dfd6' }}
                >
                  Girişim Ataması Bekleniyor
                </h3>
                <p 
                  className="[font-family:'Inter',Helvetica] text-lg"
                  style={{ color: '#aa95c7' }}
                >
                  Bu takıma henüz bir girişim projesi atanmamış.
                  <br />
                  Admin tarafından atama yapılmasını bekleyin.
                </p>
              </div>
            ) : (
              <div>
                <h3 
                  className="[font-family:'Inter',Helvetica] text-2xl font-bold mb-6"
                  style={{ color: '#e3dfd6' }}
                >
                  {portfolio.startup.name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div 
                    className="rounded-lg p-4"
                    style={{ backgroundColor: '#1b1b1b' }}
                  >
                    <div 
                      className="[font-family:'Inter',Helvetica] text-sm mb-2"
                      style={{ color: '#aa95c7' }}
                    >
                      Yatırım Değeri
                    </div>
                    <div 
                      className="[font-family:'Inter',Helvetica] text-xl font-bold"
                      style={{ color: '#cae304' }}
                    >
                      ₺{parseFloat(portfolio.startup.value).toLocaleString()}
                    </div>
                  </div>
                  
                  <div 
                    className="rounded-lg p-4"
                    style={{ backgroundColor: '#1b1b1b' }}
                  >
                    <div 
                      className="[font-family:'Inter',Helvetica] text-sm mb-2"
                      style={{ color: '#aa95c7' }}
                    >
                      Sektör
                    </div>
                    <div 
                      className="[font-family:'Inter',Helvetica] text-lg font-semibold"
                      style={{ color: '#e3dfd6' }}
                    >
                      {portfolio.startup.industry}
                    </div>
                  </div>
                  
                  <div 
                    className="rounded-lg p-4"
                    style={{ backgroundColor: '#1b1b1b' }}
                  >
                    <div 
                      className="[font-family:'Inter',Helvetica] text-sm mb-2"
                      style={{ color: '#aa95c7' }}
                    >
                      Risk Seviyesi
                    </div>
                    <div 
                      className="[font-family:'Inter',Helvetica] text-lg font-semibold"
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
                  className="rounded-lg p-6"
                  style={{ backgroundColor: '#1b1b1b' }}
                >
                  <h4 
                    className="[font-family:'Inter',Helvetica] text-lg font-semibold mb-3"
                    style={{ color: '#cae304' }}
                  >
                    Proje Açıklaması
                  </h4>
                  <p 
                    className="[font-family:'Inter',Helvetica] text-base leading-relaxed"
                    style={{ color: '#e3dfd6' }}
                  >
                    {portfolio.startup.description}
                  </p>
                </div>

                <div 
                  className="rounded-lg p-6 mt-6"
                  style={{ backgroundColor: '#1b1b1b' }}
                >
                  <h4 
                    className="[font-family:'Inter',Helvetica] text-lg font-semibold mb-4"
                    style={{ color: '#cae304' }}
                  >
                    Önemli Noktalar
                  </h4>
                  <ul 
                    className="[font-family:'Inter',Helvetica] space-y-2"
                    style={{ color: '#e3dfd6' }}
                  >
                    <li>• Yenilikçi teknoloji ve güçlü patent portföyü</li>
                    <li>• Deneyimli kurucu ekip ve güçlü danışman kurulu</li>
                    <li>• Büyük pazar potansiyeli ve ölçeklenebilir iş modeli</li>
                    <li>• Stratejik ortaklıklar ve gelir akışı çeşitliliği</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="mt-8">
        <div 
          className="rounded-2xl p-6"
          style={{ backgroundColor: '#2a2a2a' }}
        >
          <h3 
            className="[font-family:'Inter',Helvetica] text-xl font-semibold mb-4"
            style={{ color: '#e3dfd6' }}
          >
            PORTFÖY ÖZETİ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div 
                className="[font-family:'Inter',Helvetica] text-sm mb-2"
                style={{ color: '#aa95c7' }}
              >
                Nakit Bakiye
              </div>
              <div 
                className="[font-family:'Inter',Helvetica] text-2xl font-bold"
                style={{ color: '#cae304' }}
              >
                ₺{portfolio?.team?.cashBalance ? Math.round(parseFloat(portfolio.team.cashBalance)).toLocaleString() : "0"}
              </div>
            </div>
            
            <div>
              <div 
                className="[font-family:'Inter',Helvetica] text-sm mb-2"
                style={{ color: '#aa95c7' }}
              >
                Hisse Değeri
              </div>
              <div 
                className="[font-family:'Inter',Helvetica] text-2xl font-bold"
                style={{ color: '#e3dfd6' }}
              >
                ₺{portfolio?.totalStockValue ? Math.round(parseFloat(portfolio.totalStockValue)).toLocaleString() : "0"}
              </div>
            </div>
            
            <div>
              <div 
                className="[font-family:'Inter',Helvetica] text-sm mb-2"
                style={{ color: '#aa95c7' }}
              >
                Döviz Değeri
              </div>
              <div 
                className="[font-family:'Inter',Helvetica] text-2xl font-bold"
                style={{ color: '#e3dfd6' }}
              >
                ₺{portfolio?.totalCurrencyValue ? Math.round(parseFloat(portfolio.totalCurrencyValue)).toLocaleString() : "0"}
              </div>
            </div>
            
            <div>
              <div 
                className="[font-family:'Inter',Helvetica] text-sm mb-2"
                style={{ color: '#aa95c7' }}
              >
                Toplam Portföy
              </div>
              <div 
                className="[font-family:'Inter',Helvetica] text-2xl font-bold"
                style={{ color: '#cae304' }}
              >
                ₺{portfolio?.totalPortfolioValue ? Math.round(parseFloat(portfolio.totalPortfolioValue)).toLocaleString() : "0"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}