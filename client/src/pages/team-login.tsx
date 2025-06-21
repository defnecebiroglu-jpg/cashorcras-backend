import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogoManager } from "@/components/ui/logo-manager";

import { ChartLine } from "lucide-react";

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
    <div className="min-h-screen from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-end justify-center p-4 bg-[#fff5ad] pb-32">
      <LogoManager />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-lg bg-[#fee58a] relative z-50">
        <CardHeader className="text-center py-8">
          <p className="text-lg text-[#6d5f3b]">Takım Girişi</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="accessCode" className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base text-[#635a3b]">Erişim Kodu</Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Takım erişim kodunuzu girin"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                required
                className="h-12 text-base bg-[#ffffff]"
              />
            </div>
            <Button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 w-full hover:bg-[#f5d456]/90 h-12 text-base font-semibold bg-[#fff7c9] text-[#635a3b]"
              disabled={isLoading || !accessCode.trim()}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Takıma Giriş Yap"}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-base text-[#6d5f3b]">
              Admin girişi için{" "}
              <Button 
                variant="link" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 underline-offset-4 hover:underline p-0 h-auto font-normal text-base text-[#fffcf2]"
                onClick={() => setLocation("/admin-login")}
              >
                buraya tıklayın
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}