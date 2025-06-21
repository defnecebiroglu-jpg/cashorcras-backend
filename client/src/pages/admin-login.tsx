import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogoManager } from "@/components/ui/logo-manager";

import { Settings, ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 bg-[#403702]">
      <LogoManager />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-slate-800 dark:bg-slate-200 rounded-lg flex items-center justify-center mb-4">
            <Settings className="text-white dark:text-slate-800 h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Yönetici Girişi
          </CardTitle>
          <p className="text-muted-foreground">Cash or Crash Admin Paneli</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Yönetici Şifresi</Label>
              <Input
                id="password"
                type="password"
                placeholder="Admin şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              className="text-muted-foreground"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Takım Girişine Dön
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}