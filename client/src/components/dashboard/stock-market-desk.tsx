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
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Team's Stock Portfolio */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hisse Senedi Portföyünüz</CardTitle>
            <p className="text-sm text-muted-foreground">Mevcut varlıklar ve performans</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolio?.stocks.map((stock) => (
                <div key={stock.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={stock.company.logoUrl || "/api/placeholder/40/40"} 
                      alt={stock.company.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium text-slate-900">{stock.company.name}</div>
                      <div className="text-sm text-slate-600">{stock.shares} shares</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-900">
                      ${(parseFloat(stock.company.price) * stock.shares).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-green-600">
                      {parseFloat(stock.company.dividend) > 0 ? `${stock.company.dividend}% dividend` : "No dividend"}
                    </div>
                  </div>
                </div>
              ))}
              
              {portfolio?.stocks.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  No stock holdings
                </div>
              )}
              
              <Separator />
              <div className="flex justify-between items-center pt-4">
                <span className="font-medium text-slate-900">Total Stock Value:</span>
                <span className="font-bold text-lg text-slate-900">
                  ${portfolio ? parseFloat(portfolio.totalStockValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Stocks */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Companies</CardTitle>
            <p className="text-sm text-muted-foreground">Available stocks for investment</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companies?.map((company) => (
                <div key={company.id} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={company.logoUrl || "/api/placeholder/48/48"} 
                      alt={company.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-slate-900">{company.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">{company.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-slate-900">
                            ${parseFloat(company.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-green-600">
                            {parseFloat(company.dividend) > 0 ? `${company.dividend}% dividend` : "No dividend"}
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
  );
}
