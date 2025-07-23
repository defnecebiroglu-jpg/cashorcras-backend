import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Users, ArrowLeft, ChevronRight } from "lucide-react";

const colors = {
  background: '#1B1B1B',
  textPrimary: '#E3DFD6',
  textSecondary: '#1B1B1B',
  accent: 'rgba(202, 227, 4, 0.90)',
  button: '#AA95C7',
  teamAccent: '#4ADE80', // Green accent for team
  card: '#2A2A2A'
};

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
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-10 top-20 left-20"
          style={{ backgroundColor: colors.teamAccent }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full opacity-5 bottom-20 right-20"
          style={{ backgroundColor: colors.button }}
        />
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-white/10"
            style={{ color: colors.textPrimary }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfa
          </Button>
        </Link>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className="w-full max-w-md relative z-10">
        {/* Team indicator badge */}
        <div className="text-center mb-6">
          <div 
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: colors.teamAccent + '20',
              color: colors.teamAccent,
              border: `1px solid ${colors.teamAccent}40`
            }}
          >
            <Users className="w-4 h-4 mr-2" />
            TAKIM GİRİŞİ
          </div>
        </div>

        <Card 
          className="border-0 shadow-2xl"
          style={{ backgroundColor: colors.card }}
        >
          <CardHeader className="text-center pb-8">
            <div 
              className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              style={{ backgroundColor: colors.teamAccent }}
            >
              <Users className="h-8 w-8" style={{ color: colors.textSecondary }} />
            </div>
            
            <CardTitle 
              className="text-3xl font-bold mb-2"
              style={{ 
                color: colors.textPrimary,
                fontFamily: 'Bowlby One',
                fontWeight: 'normal'
              }}
            >
              CASH OR CRASH
            </CardTitle>
            
            <p 
              className="text-lg"
              style={{ color: colors.textPrimary + '80' }}
            >
              Takım Platformuna Hoşgeldiniz
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label 
                  htmlFor="accessCode"
                  className="text-base font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  Takım Erişim Kodu
                </Label>
                <Input
                  id="accessCode"
                  type="text"
                  placeholder="Takım kodunuzu girin (örn: TEAM01)"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  required
                  className="h-12 text-lg border-0 bg-white/10 text-white placeholder:text-white/50 focus:bg-white/20 transition-colors"
                  style={{ color: colors.textPrimary }}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                disabled={isLoading || !accessCode.trim()}
                style={{ 
                  backgroundColor: colors.teamAccent,
                  color: colors.textSecondary
                }}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                    Giriş Yapılıyor...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Takıma Katıl
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <div 
                className="h-px w-full mb-6"
                style={{ backgroundColor: colors.textPrimary + '20' }}
              />
              <p 
                className="text-sm mb-3"
                style={{ color: colors.textPrimary + '60' }}
              >
                Yönetici misiniz?
              </p>
              <Button 
                variant="ghost"
                className="text-sm hover:bg-white/10 p-0 h-auto"
                style={{ color: colors.button }}
                onClick={() => setLocation("/admin-login")}
              >
                Admin paneline geçin
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}