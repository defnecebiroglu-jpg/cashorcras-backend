import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ChartLine, Move } from "lucide-react";
import logoImage from "@assets/Adsız tasarım (6)_1750263227259.png";

export default function TeamLogin() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [logoScale, setLogoScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const containerRect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    const relativeY = e.clientY - containerRect.top;
    
    // Calculate scale based on distance from center
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    const distance = Math.sqrt(Math.pow(relativeX - centerX, 2) + Math.pow(relativeY - centerY, 2));
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    
    const newScale = Math.max(0.5, Math.min(3, 0.5 + (distance / maxDistance) * 2.5));
    setLogoScale(newScale);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
    <div className="min-h-screen from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 bg-[#fff5ad]">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        {/* Logo Frame */}
        <div className="bg-white rounded-t-lg border border-b-0 p-6 text-center shadow-sm">
          <div 
            className="mx-auto w-48 h-32 flex items-center justify-center relative border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              src={logoImage} 
              alt="Cash or Crash Logo" 
              className="object-contain pointer-events-none transition-transform duration-200"
              style={{ 
                transform: `scale(${logoScale})`,
                maxWidth: 'none',
                maxHeight: 'none'
              }}
            />
            {/* Scale Display */}
            <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              {Math.round(logoScale * 100)}%
            </div>
            <div className="absolute bottom-1 right-1 text-xs text-gray-500">
              Drag to resize
            </div>
          </div>
        </div>

        <Card className="rounded-t-none rounded-b-lg border text-card-foreground shadow-sm bg-[#fbf7eb]">
          <CardHeader className="text-center pt-4">
            <CardTitle className="text-2xl font-bold">
              Cash or Crash
            </CardTitle>
            <p className="text-muted-foreground">Takım Girişi</p>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessCode">Erişim Kodu</Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Takım erişim kodunuzu girin"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !accessCode.trim()}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Takıma Giriş Yap"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Admin girişi için{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal text-primary"
                onClick={() => setLocation("/admin-login")}
              >
                buraya tıklayın
              </Button>
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}