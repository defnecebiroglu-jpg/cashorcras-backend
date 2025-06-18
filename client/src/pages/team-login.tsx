import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import logoImage from "@assets/cash-or-crash-logo.png";

export default function TeamLogin() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const logoSize = { width: 400, height: 300 };
  const logoPosition = { x: 0, y: -50 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode }),
      });

      if (response.ok) {
        const team = await response.json();
        toast({
          title: "Başarılı",
          description: `Hoş geldiniz, ${team.name}!`,
        });
        setLocation("/team-dashboard");
      } else {
        const error = await response.json();
        toast({
          title: "Hata",
          description: error.error || "Geçersiz erişim kodu",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bağlantı hatası",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-start justify-center pt-16 p-4 bg-[#fff5ad]">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        {/* Logo Frame */}
        <div className="rounded-t-lg p-6 text-center shadow-sm mt-[-23px] mb-[-40px] pt-[0px] pb-[0px] ml-[0px] mr-[0px] pl-[14px] pr-[14px] bg-[#fff5ad] relative">
          <div 
            className="mx-auto flex items-center justify-center relative"
            style={{ 
              width: logoSize.width, 
              height: logoSize.height,
              transform: `translate(${logoPosition.x}px, ${logoPosition.y}px)`
            }}
          >
            <img 
              src={logoImage} 
              alt="Cash or Crash Logo" 
              className="w-full h-full object-contain drop-shadow-sm"
              style={{ width: logoSize.width, height: logoSize.height }}
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
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Takım erişim kodunuzu girin"
                required
                className="bg-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#c7a230] hover:bg-[#b8932a] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}