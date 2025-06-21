import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { TrendingUp } from "lucide-react";
import coinImage from "@assets/Adsız tasarım (6)_1750263227259.png";

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden">
      

      
      
      <div className="bg-[#FFFAE2] p-10 rounded-xl text-center w-80 shadow-lg font-sans relative z-10 pt-20">
        {/* Logo */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <img 
            src={coinImage} 
            alt="Cash or Crash Logo" 
            className="w-80 h-60"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Takım erişim kodunuzu girin"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            required
            className="p-2.5 w-full mb-2.5 border border-gray-300 rounded text-black"
          />
          <button
            type="submit"
            disabled={isLoading || !accessCode.trim()}
            className="p-2.5 bg-[#E4B300] border-none w-full text-white cursor-pointer rounded hover:bg-[#d4a300] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Giriş Yapılıyor..." : "Takıma Giriş Yap"}
          </button>
        </form>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Admin girişi için{" "}
            <button 
              className="text-[#E4B300] underline bg-transparent border-none cursor-pointer"
              onClick={() => setLocation("/admin-login")}
            >
              buraya tıklayın
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}