import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Shield, ArrowLeft, Users } from "lucide-react";

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
    <div className="min-h-screen bg-[#1B1B1B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-300 rounded-full blur-3xl"></div>
      </div>

      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-[#E3DFD6] hover:text-white hover:bg-white/10 transition-all duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfa
          </Button>
        </Link>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Main card */}
      <Card className="w-full max-w-md bg-[#2A2A2A] border-[#3A3A3A] shadow-2xl backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          {/* Icon with badge */}
          <div className="relative mx-auto mb-6">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="text-white h-8 w-8" />
            </div>
            <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              ADMIN
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold text-[#E3DFD6] mb-2">
            Cash or Crash
          </CardTitle>
          <p className="text-[#B0B0B0] text-lg">Yönetici Girişi</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="password" className="text-[#E3DFD6] text-sm font-medium">
                Yönetici Şifresi
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Admin şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-[#3A3A3A] border-[#4A4A4A] text-[#E3DFD6] placeholder-[#888] focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-orange-500/25"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          {/* Cross navigation */}
          <div className="pt-4 border-t border-[#3A3A3A]">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-emerald-500" />
              <span className="text-[#B0B0B0]">Takım girişi için</span>
              <Button 
                variant="link" 
                className="p-0 h-auto font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
                onClick={() => setLocation("/team-login")}
              >
                buraya tıklayın
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}