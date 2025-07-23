import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
    <main className="bg-[#1b1b1b] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#1b1b1b] w-full max-w-[1440px] min-h-screen relative flex items-center justify-center">
        
        {/* Header */}
        <header className="flex w-full items-end justify-between p-8 absolute top-0 left-0">
          <h1 className="relative w-fit h-[47px] [font-family:'Bowlby_One',Helvetica] font-normal text-[#e3dfd6] text-2xl tracking-[0] leading-[normal]">
            KALGIRISIMCILIK
          </h1>

          <nav className="flex w-fit items-end gap-10 relative">
            <Link href="/">
              <div className="relative w-fit h-[47px] [font-family:'Bowlby_One',Helvetica] font-normal text-[#e3dfd6] text-2xl tracking-[0] leading-[normal] cursor-pointer hover:text-[#aa95c7] transition-colors">
                ANA SAYFA
              </div>
            </Link>

            <Link href="/admin-login">
              <Button className="h-[50px] px-6 py-0 bg-[#aa95c7] rounded-lg hover:bg-[#9a85b7] transition-colors">
                <span className="[font-family:'Bowlby_One',Helvetica] font-normal text-[#1b1b1b] text-2xl text-center tracking-[0] leading-[normal]">
                  ADMIN GIRIS
                </span>
              </Button>
            </Link>
          </nav>
        </header>

        {/* Main Login Section */}
        <div className="flex flex-col items-center justify-center z-10">
          
          {/* Title */}
          <h2 className="[font-family:'Bowlby_One',Helvetica] font-normal text-[#e3dfd6] text-6xl text-center tracking-[0] leading-[70px] mb-12">
            TAKIM GIRISI
          </h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
            <div className="space-y-4">
              <label className="block [font-family:'Bowlby_One',Helvetica] font-normal text-[#e3dfd6] text-xl tracking-[0] leading-[normal]">
                ERISIM KODU
              </label>
              <Input
                type="text"
                placeholder="Takim kodunuzu girin"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
                className="h-16 bg-[#2a2a2a] border-2 border-[#4a4a4a] text-[#e3dfd6] placeholder-[#888] focus:border-[#aa95c7] focus:ring-[#aa95c7]/20 text-2xl font-bold text-center tracking-wider [font-family:'Bowlby_One',Helvetica] rounded-lg"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading || !accessCode.trim()}
              className="w-full h-16 bg-[#aa95c7] hover:bg-[#9a85b7] text-[#1b1b1b] transition-all duration-200 shadow-lg rounded-lg"
            >
              <span className="[font-family:'Bowlby_One',Helvetica] font-normal text-2xl text-center tracking-[0] leading-[normal]">
                {isLoading ? "GIRIS YAPILIYOR..." : "OYUNA BASLA"}
              </span>
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-12 text-center">
            <Link href="/admin-login">
              <span className="[font-family:'Inter',Helvetica] font-semibold text-[#e3dfd6] text-lg tracking-[0] leading-[normal] cursor-pointer hover:text-[#aa95c7] transition-colors">
                Yönetici misiniz? Admin girisi için tiklayin
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}