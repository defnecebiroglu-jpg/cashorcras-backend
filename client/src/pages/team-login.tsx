import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function TeamLogin() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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
        <div className="rounded-t-lg p-6 text-center shadow-sm mt-[-23px] mb-[-23px] pt-[0px] pb-[0px] ml-[0px] mr-[0px] pl-[14px] pr-[14px] bg-[#fff5ad]">
          <svg 
            width="192" 
            height="128" 
            viewBox="0 0 400 200" 
            className="mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect width="400" height="200" fill="#fff5ad" rx="10"/>
            
            {/* CASH text */}
            <text 
              x="200" 
              y="80" 
              textAnchor="middle" 
              className="text-5xl font-bold" 
              fill="#4ade80"
              fontFamily="Arial Black, sans-serif"
            >
              CASH
            </text>
            
            {/* OR text */}
            <text 
              x="200" 
              y="110" 
              textAnchor="middle" 
              className="text-lg font-bold" 
              fill="#fbbf24"
              fontFamily="Arial, sans-serif"
            >
              OR
            </text>
            
            {/* CRASH text */}
            <text 
              x="200" 
              y="150" 
              textAnchor="middle" 
              className="text-4xl font-bold" 
              fill="#ef4444"
              fontFamily="Arial Black, sans-serif"
            >
              CRASH
            </text>
            
            {/* Decorative elements */}
            <circle cx="50" cy="50" r="20" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.6"/>
            <circle cx="350" cy="150" r="25" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.6"/>
            <path d="M30 120 L70 100 L50 140 Z" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.6"/>
            <path d="M330 60 L370 40 L350 80 Z" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.6"/>
          </svg>
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