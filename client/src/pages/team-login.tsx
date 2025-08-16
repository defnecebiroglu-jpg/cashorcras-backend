import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const colors = {
  background: '#1B1B1B',
  textPrimary: '#E3DFD6',
  textSecondary: '#1B1B1B',
  accent: '#AA95C7',
  button: '#E3DFD6',
  buttonText: '#8A8A8A',
  linkHighlight: '#CBED46',
  cardBorder: '#AA95C7',
  inputBg: '#AA95C766'
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
    <div className="w-full min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container-responsive min-h-screen relative" style={{ backgroundColor: colors.background }}>
        
        {/* Header */}
        <header className="flex w-full items-center justify-between p-4 md:p-8 relative">
          <Link href="/">
            <h1 
              className="font-bowlby text-responsive-md cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: colors.textPrimary }}
            >
              KALGIRISIMCILIK
            </h1>
          </Link>

          <nav className="flex items-center">
            <div 
              className="font-bowlby text-sm md:text-xl lg:text-2xl hidden sm:block"
              style={{ color: colors.textSecondary }}
            >
              HAKKINDA
            </div>
          </nav>
        </header>

        {/* Banner text - responsive */}
        <div 
          className="hidden lg:block absolute w-[3432px] top-[154px] left-[-996px] text-8xl text-center tracking-[0] leading-[80px] whitespace-nowrap"
          style={{ 
            color: colors.linkHighlight
          }}
        >
          <span className="font-bowlby">CASH OR CRASH OR CASH OR CRASH</span>
        </div>

        <div className="mt-8 md:mt-16 px-4 flex flex-col lg:flex-row items-center justify-center min-h-[60vh]">
          {/* Vector graphics */}
          <img
            className="absolute top-[401px] left-0 w-[265px] h-[229px]"
            alt="Vector graphic"
            src="/figmaAssets/vector-2.svg"
          />
          <img
            className="absolute top-[50px] left-[921px] w-[265px] h-[229px]"
            alt="Vector graphic"
            src="/figmaAssets/vector-3.svg"
          />

          {/* Login card - Team version - responsive */}
          <Card 
            className="w-full max-w-[700px] mx-auto rounded-[25px] border-4 border-solid relative z-10"
            style={{ 
              backgroundColor: colors.background, 
              borderColor: colors.cardBorder 
            }}
          >
            <CardContent className="flex flex-col items-center gap-6 md:gap-[42px] p-6 md:p-10">
              <h1 
                className="font-bowlby text-responsive-lg text-center w-full"
                style={{ color: colors.textPrimary }}
              >
                TAKIM GİRİŞİ
              </h1>

              <form onSubmit={handleSubmit} className="w-full space-y-6 md:space-y-[42px]">
                <div className="w-full">
                  <Input
                    className="h-12 md:h-[60px] rounded-lg border-2 border-solid text-lg md:text-[30px] font-inter px-4 md:px-5"
                    style={{ 
                      backgroundColor: colors.inputBg,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary
                    }}
                    placeholder="Takım erişim kodunu giriniz"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  className="inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-primary/90 h-[60px] justify-center gap-2.5 px-6 py-0 w-full rounded-lg transition-colors hover:opacity-90 text-[#1b1b1b] bg-[#cbed46]"
                  style={{ backgroundColor: colors.button }}
                  disabled={isLoading || !accessCode.trim()}
                >
                  <span 
                    className="w-fit text-[32px] text-center tracking-[0] leading-normal"
                    style={{ 
                      color: '#1b1b1b', 
                      fontFamily: 'Bowlby One', 
                      fontWeight: 'normal' 
                    }}
                  >
                    {isLoading ? "GIRIS YAPILIYOR..." : "GIRIS YAP"}
                  </span>
                </Button>
              </form>

              <div className="w-full text-center">
                <span 
                  className="font-inter text-lg md:text-3xl"
                  style={{ color: colors.textPrimary }}
                >
                  Admin girişi için{" "}
                </span>
                <Link href="/admin-login">
                  <button 
                    className="font-inter text-lg md:text-3xl font-medium hover:underline transition-all"
                    style={{ color: colors.linkHighlight }}
                  >
                    buraya tıklayınız
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}