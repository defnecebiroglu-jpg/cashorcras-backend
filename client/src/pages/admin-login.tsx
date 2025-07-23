import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isAdmin", "true");
        setLocation("/admin");
        toast({ title: "Admin girişi başarılı!" });
      } else {
        toast({ 
          title: "Giriş Hatası", 
          description: data.message || "Geçersiz şifre",
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
    <div className="min-h-screen bg-[#1B1B1B] flex items-center justify-center p-4 relative">
      {/* Header with brand name */}
      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold text-[#E3DFD6]" style={{ fontFamily: "'Bowlby One', cursive" }}>
          KALGIRISIMCILIK
        </h1>
      </div>

      {/* Back button */}
      <div className="absolute top-8 right-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-[#E3DFD6] hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfa
          </Button>
        </Link>
      </div>

      {/* Main login card */}
      <Card className="w-full max-w-lg bg-[#2A2A2A] border-[#3A3A3A] shadow-2xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-4xl font-bold text-[#E3DFD6] mb-4" style={{ fontFamily: "'Bowlby One', cursive" }}>
            YÖNETİCİ GİRİŞİ
          </CardTitle>
          <p className="text-[#B0B0B0] text-lg">
            Admin paneline erişim için şifrenizi girin
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label 
                htmlFor="password" 
                className="text-[#E3DFD6] text-lg font-semibold"
                style={{ fontFamily: "'Bowlby One', cursive" }}
              >
                YÖNETİCİ ŞİFRESİ
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Admin şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-16 bg-[#3A3A3A] border-[#4A4A4A] text-[#E3DFD6] placeholder-[#888] focus:border-[#AA95C7] focus:ring-[#AA95C7]/20 text-2xl font-bold text-center tracking-wider"
                style={{ fontSize: "30px", fontFamily: "'Bowlby One', cursive" }}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-16 bg-[#AA95C7] hover:bg-[#9A85B7] text-[#1B1B1B] font-bold text-xl transition-all duration-200 shadow-lg"
              style={{ fontFamily: "'Bowlby One', cursive" }}
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? "GİRİŞ YAPILIYOR..." : "ADMİN PANELİNE GİR"}
            </Button>
          </form>

          {/* Team login link */}
          <div className="pt-6 border-t border-[#3A3A3A] text-center">
            <p className="text-[#B0B0B0] text-sm mb-2">Takım üyesi misiniz?</p>
            <Button 
              variant="link" 
              className="text-[#AA95C7] hover:text-[#9A85B7] font-semibold"
              onClick={() => setLocation("/team-login")}
            >
              Takım girişi için tıklayın
            </Button>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}