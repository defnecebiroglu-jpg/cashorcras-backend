import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-screen bg-[#FFF5AD] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Background decorative images */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-[419px] h-[429px] transform -rotate-30 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full"></div>
        </div>
        <div className="absolute top-40 right-20 w-[371px] h-[349px] transform rotate-[100deg] opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-400 rounded-full"></div>
        </div>
        <div className="absolute bottom-40 left-40 w-[545px] h-[524px] transform rotate-[110deg] opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full"></div>
        </div>
        <div className="absolute bottom-20 right-40 w-[590px] h-[590px] transform -rotate-45 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 rounded-full"></div>
        </div>
        <div className="absolute top-60 left-60 w-[333px] h-[354px] transform -rotate-[10deg] opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full"></div>
        </div>
        <div className="absolute bottom-60 right-60 w-[388px] h-[373px] transform rotate-[70deg] opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 rounded-full"></div>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-8 z-10">
        {/* Main logo/image */}
        <div className="flex justify-center mb-8">
          <div className="w-[679px] h-[581px] max-w-full max-h-[400px] bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl shadow-lg flex items-center justify-center">
            <div className="w-[182px] h-[182px] relative shadow-[inset_0_4px_4px_#B18F13] rounded-lg">
              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <div className="text-6xl font-bold text-white">₺</div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 
            className="text-[#E4B300] font-bold leading-tight mb-4"
            style={{ 
              fontSize: 'clamp(32px, 5vw, 53.45px)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              lineHeight: '1.3'
            }}
          >
            TAKIM GİRİŞİ
          </h1>
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div 
                className="text-[#BD9E2C] mb-4"
                style={{ 
                  fontSize: 'clamp(20px, 3vw, 36px)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  lineHeight: '1.3'
                }}
              >
                Erişim kodunu giriniz.
              </div>
              <Input
                id="accessCode"
                type="text"
                placeholder="Erişim kodunuzu girin"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
                className="h-12 text-lg bg-white/80 border-2 border-[#BD9E2C] focus:border-[#E4B300] rounded-lg"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 text-[#927201] bg-gradient-to-r from-yellow-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 border-2 border-[#BD9E2C] rounded-lg font-semibold"
              style={{ 
                fontSize: 'clamp(18px, 2.5vw, 36px)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              disabled={isLoading || !accessCode.trim()}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <div 
              className="inline"
              style={{ 
                fontSize: 'clamp(16px, 2.5vw, 36px)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.3'
              }}
            >
              <span className="text-[#BF9E27] font-bold">Admin girişi için </span>
              <button 
                className="text-[#927201] font-bold hover:underline"
                onClick={() => setLocation("/admin-login")}
              >
                buraya tıklayınız.
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}