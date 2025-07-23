import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, ArrowLeft, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-[#1B1B1B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-green-400/5 to-green-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-emerald-500/8 to-green-600/5 rounded-full blur-lg"></div>
      </div>

      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-[#E3DFD6] hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfa
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-lg bg-[#2A2A2A]/90 backdrop-blur-sm border-[#3A3A3A] shadow-2xl relative z-10">
        <CardHeader className="text-center pb-2">
          {/* Team indicator badge */}
          <div className="mx-auto w-fit px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full mb-4">
            <span className="text-green-400 text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              TAKIM GİRİŞİ
            </span>
          </div>
          
          <div className="mx-auto w-16 h-16 bg-green-500/20 border-2 border-green-500/40 rounded-2xl flex items-center justify-center mb-4">
            <Users className="text-green-400 h-8 w-8" />
          </div>
          
          <CardTitle className="text-3xl font-bold text-[#E3DFD6] mb-2" style={{ fontFamily: 'Bowlby One' }}>
            CASH OR CRASH
          </CardTitle>
          <p className="text-[#AA95C7] text-lg font-medium">Takım Girişi</p>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="accessCode" className="text-[#E3DFD6] text-base font-medium">
                Erişim Kodu
              </Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Takım erişim kodunuzu girin"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
                className="h-12 bg-[#1B1B1B] border-[#3A3A3A] text-[#E3DFD6] placeholder:text-[#7A7A7A] focus:border-green-500/50 focus:ring-green-500/20 text-lg"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading || !accessCode.trim()}
              style={{ fontFamily: 'Bowlby One' }}
            >
              {isLoading ? "GİRİŞ YAPILIYOR..." : "TAKIMA GİRİŞ YAP"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-[#7A7A7A] mb-3">
              <div className="flex-1 h-px bg-[#3A3A3A]"></div>
              <span>VEYA</span>
              <div className="flex-1 h-px bg-[#3A3A3A]"></div>
            </div>
            <Button 
              variant="ghost" 
              className="text-[#AA95C7] hover:text-white hover:bg-[#AA95C7]/10 transition-colors flex items-center gap-2"
              onClick={() => setLocation("/admin-login")}
            >
              <Shield className="w-4 h-4" />
              Admin Girişine Geç
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}