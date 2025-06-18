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
        <div className="rounded-t-lg p-6 text-center shadow-sm bg-[#fbf7eb] mt-[-23px] mb-[-23px] pt-[0px] pb-[0px] ml-[0px] mr-[0px] pl-[14px] pr-[14px]">
          <div 
            ref={logoRef}
            className="mx-auto flex items-center justify-center relative"
            style={{ width: logoSize.width, height: logoSize.height }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              src={logoImage} 
              alt="Cash or Crash Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <Card className="rounded-t-none rounded-b-lg border-none text-card-foreground shadow-sm bg-[#fbf7eb]">
          <CardHeader className="text-center pt-4">
            <p className="text-[#c7a230] text-[20px] font-bold ml-[6px] mr-[6px] mt-[-1px] mb-[-1px] pt-[-5px] pb-[-5px] pl-[0px] pr-[0px]">TAKIM GİRİŞİ</p>
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