import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogoManager } from "@/components/ui/logo-manager";
import coinImage from "@assets/C (2) 5 (2)_1750529353646.png";
import { ChartLine } from "lucide-react";

export default function TeamLogin() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Coin states - inline implementation
  const [coins, setCoins] = useState([
    { id: 1, x: 200, y: 200, size: 60, rotation: 0, selected: false },
    { id: 2, x: 300, y: 250, size: 60, rotation: 0, selected: false },
    { id: 3, x: 400, y: 300, size: 60, rotation: 0, selected: false },
    { id: 4, x: 500, y: 200, size: 60, rotation: 0, selected: false },
    { id: 5, x: 600, y: 250, size: 60, rotation: 0, selected: false },
    { id: 6, x: 700, y: 300, size: 60, rotation: 0, selected: false },
  ]);
  const [draggedCoin, setDraggedCoin] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Coin event handlers
  const handleCoinMouseDown = (e: React.MouseEvent, coinId: number) => {
    e.preventDefault();
    setDraggedCoin(coinId);
    setDragOffset({
      x: e.clientX - coins.find(c => c.id === coinId)!.x,
      y: e.clientY - coins.find(c => c.id === coinId)!.y,
    });
    
    // Select coin
    setCoins(prevCoins => 
      prevCoins.map(coin => ({ ...coin, selected: coin.id === coinId }))
    );
  };

  const handleCoinWheel = (e: React.WheelEvent, coinId: number) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setCoins(prevCoins =>
        prevCoins.map(coin =>
          coin.id === coinId
            ? { ...coin, size: Math.max(20, Math.min(200, coin.size * scaleFactor)) }
            : coin
        )
      );
    }
  };

  // Global mouse and keyboard events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedCoin !== null) {
        setCoins(prevCoins =>
          prevCoins.map(coin =>
            coin.id === draggedCoin
              ? { ...coin, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
              : coin
          )
        );
      }
    };

    const handleMouseUp = () => {
      setDraggedCoin(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedCoin = coins.find(c => c.selected);
      if (selectedCoin) {
        if (e.key.toLowerCase() === 'r') {
          setCoins(prevCoins =>
            prevCoins.map(coin =>
              coin.selected ? { ...coin, rotation: (coin.rotation + 15) % 360 } : coin
            )
          );
        } else if (e.key.toLowerCase() === 'e') {
          setCoins(prevCoins =>
            prevCoins.map(coin =>
              coin.selected ? { ...coin, rotation: (coin.rotation - 15 + 360) % 360 } : coin
            )
          );
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [draggedCoin, dragOffset, coins]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("teamId", data.team.id.toString());
        localStorage.setItem("teamName", data.team.name);
        setLocation(`/team/${data.team.id}`);
        toast({ title: `Hoşgeldiniz ${data.team.name}!` });
      } else {
        toast({ 
          title: "Giriş Hatası", 
          description: data.message || "Geçersiz erişim kodu",
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Bağlantı Hatası", 
        description: "Sunucu ile bağlantı kurulamadı",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-end justify-center p-4 bg-[#fff5ad] pb-32">
      <LogoManager />
      {/* Draggable Coins */}
      {coins.map((coin) => (
        <div
          key={coin.id}
          className={`fixed z-40 cursor-grab select-none ${
            coin.selected ? 'ring-2 ring-yellow-400' : ''
          }`}
          style={{
            left: `${coin.x}px`,
            top: `${coin.y}px`,
            width: `${coin.size}px`,
            height: `${coin.size}px`,
            transform: `rotate(${coin.rotation}deg)`,
          }}
          onMouseDown={(e) => handleCoinMouseDown(e, coin.id)}
          onWheel={(e) => handleCoinWheel(e, coin.id)}
        >
          <img
            src={coinImage}
            alt={`Coin ${coin.id}`}
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
        </div>
      ))}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-lg bg-[#fbf7eb]">
        <CardHeader className="text-center py-8">
          <p className="text-muted-foreground text-lg">Takım Girişi</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="accessCode" className="text-base">Erişim Kodu</Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Takım erişim kodunuzu girin"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
                className="h-12 text-base"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#f5d456] text-[#000000] hover:bg-[#f5d456]/90 h-12 text-base font-semibold"
              disabled={isLoading || !accessCode.trim()}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Takıma Giriş Yap"}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-base text-muted-foreground">
              Admin girişi için{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal text-[#c79d0a] text-base"
                onClick={() => setLocation("/admin-login")}
              >
                buraya tıklayın
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}