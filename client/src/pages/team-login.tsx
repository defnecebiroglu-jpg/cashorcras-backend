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
    <div className="min-h-screen bg-[#FFF5AD] flex flex-col items-center justify-center relative overflow-hidden p-4">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Background decorative images */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 left-20 w-[419px] h-[429px] transform -rotate-30 origin-top-left">
          <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full blur-sm"></div>
        </div>
        <div className="absolute top-40 right-20 w-[371px] h-[349px] transform rotate-[100deg] origin-top-left">
          <div className="w-full h-full bg-gradient-to-br from-orange-200 to-orange-400 rounded-full blur-sm"></div>
        </div>
        <div className="absolute bottom-40 left-40 w-[545px] h-[524px] transform rotate-[110deg] origin-top-left">
          <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full blur-sm"></div>
        </div>
        <div className="absolute bottom-20 right-40 w-[590px] h-[590px] transform -rotate-45 origin-top-left">
          <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-400 rounded-full blur-sm"></div>
        </div>
        <div className="absolute top-60 left-60 w-[333px] h-[354px] transform -rotate-[10deg] origin-top-left">
          <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full blur-sm"></div>
        </div>
        <div className="absolute bottom-60 right-60 w-[388px] h-[373px] transform rotate-[70deg] origin-top-left">
          <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 rounded-full blur-sm"></div>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex flex-col items-center justify-center space-y-8 z-10 max-w-4xl w-full">
        
        {/* Main image placeholder */}
        <div className="w-[679px] h-[581px] max-w-[90vw] max-h-[40vh] bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg shadow-lg flex items-center justify-center relative">
          <div className="w-[182px] h-[182px] relative">
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-[inset_0_4px_4px_#B18F13] flex items-center justify-center">
              <div className="text-6xl font-bold text-white">₺</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 
            className="text-[#E4B300] font-normal"
            style={{ 
              fontSize: '53.45px',
              fontFamily: 'Jockey One, system-ui, -apple-system, sans-serif',
              lineHeight: '70.55px',
              fontWeight: 400
            }}
          >
            TAKIM GİRİŞİ
          </h1>
        </div>

        {/* Form section */}
        <div className="w-full max-w-md space-y-6">
          <div 
            className="text-[#BD9E2C]"
            style={{ 
              fontSize: '36px',
              fontFamily: 'Mukta, system-ui, -apple-system, sans-serif',
              lineHeight: '47.52px',
              fontWeight: 400
            }}
          >
            Erişim kodunu giriniz.
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="accessCode"
              type="text"
              placeholder=""
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              required
              className="h-16 text-2xl bg-white border-2 border-[#BD9E2C] focus:border-[#E4B300] rounded-lg px-4"
            />
            
            <Button
              type="submit"
              className="w-full h-16 text-[#927201] bg-white hover:bg-gray-50 border-2 border-[#BD9E2C] rounded-lg"
              style={{ 
                fontSize: '36px',
                fontFamily: 'Mukta, system-ui, -apple-system, sans-serif',
                lineHeight: '47.52px',
                fontWeight: 400
              }}
              disabled={isLoading || !accessCode.trim()}
              variant="outline"
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          <div className="text-center">
            <div style={{ 
              fontSize: '36px',
              fontFamily: 'Sulphur Point, system-ui, -apple-system, sans-serif',
              lineHeight: '47.52px',
              fontWeight: 700
            }}>
              <span className="text-[#BF9E27]">Admin girişi için </span>
              <button 
                className="text-[#927201] hover:underline"
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