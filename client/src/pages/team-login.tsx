import { useState, useRef } from "react";
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
  const [logoSize, setLogoSize] = useState({ width: 192, height: 128 }); // w-48 h-32 in pixels
  const [isDragging, setIsDragging] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !logoRef.current) return;
    
    const rect = logoRef.current.getBoundingClientRect();
    const newWidth = Math.max(100, e.clientX - rect.left);
    const newHeight = Math.max(60, e.clientY - rect.top);
    
    setLogoSize({ width: newWidth, height: newHeight });
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
            ref={logoRef}
            className="mx-auto flex items-center justify-center relative border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
            style={{ width: logoSize.width, height: logoSize.height }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              src={logoImage} 
              alt="Cash or Crash Logo" 
              className="w-full h-full object-contain pointer-events-none"
            />
            {/* Resize Handle */}
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 hover:bg-blue-600 cursor-se-resize opacity-70 hover:opacity-100 transition-opacity"
              onMouseDown={handleMouseDown}
            >
              <Move className="w-3 h-3 text-white m-0.5" />
            </div>
            {/* Size Display */}
            <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              {Math.round(logoSize.width)}×{Math.round(logoSize.height)}
            </div>
          </div>
          
          {/* Manual Size Controls */}
          <div className="mt-4 flex gap-2 justify-center">
            <div className="flex items-center gap-1">
              <Label htmlFor="logoWidth" className="text-xs">W:</Label>
              <Input
                id="logoWidth"
                type="number"
                min="100"
                max="400"
                value={Math.round(logoSize.width)}
                onChange={(e) => setLogoSize(prev => ({ ...prev, width: parseInt(e.target.value) || 100 }))}
                className="w-16 h-6 text-xs"
              />
            </div>
            <div className="flex items-center gap-1">
              <Label htmlFor="logoHeight" className="text-xs">H:</Label>
              <Input
                id="logoHeight"
                type="number"
                min="60"
                max="300"
                value={Math.round(logoSize.height)}
                onChange={(e) => setLogoSize(prev => ({ ...prev, height: parseInt(e.target.value) || 60 }))}
                className="w-16 h-6 text-xs"
              />
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