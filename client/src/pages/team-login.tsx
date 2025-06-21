import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TrendingUp } from "lucide-react";
import coinImage from "@assets/Adsız tasarım (6)_1750263227259.png";
import newLogoImage from "@assets/Adsız tasarım (7)_1750525965730.png";

export default function TeamLogin() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Draggable logo state
  const [logoPosition, setLogoPosition] = useState({ x: 200, y: 50 });
  const [logoSize, setLogoSize] = useState({ width: 300, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const logoRef = useRef<HTMLDivElement>(null);

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - logoPosition.x, y: e.clientY - logoPosition.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse wheel for resizing
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setLogoSize(prev => ({
        width: Math.max(50, Math.min(800, prev.width * scaleFactor)),
        height: Math.max(33, Math.min(533, prev.height * scaleFactor))
      }));
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setLogoPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

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
      className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden"
      onWheel={handleWheel}
    >
      {/* Draggable Logo */}
      <div
        ref={logoRef}
        className={`absolute z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} border-2 border-dashed border-blue-300 border-opacity-30 hover:border-opacity-60 transition-all`}
        style={{
          left: logoPosition.x,
          top: logoPosition.y,
          width: logoSize.width + 40,
          height: logoSize.height + 40,
          padding: '20px',
        }}
        onMouseDown={handleMouseDown}
      >
        <img 
          src={newLogoImage} 
          alt="Cash or Crash Logo" 
          className="w-full h-full object-contain pointer-events-none"
          draggable={false}
        />
        <div className="absolute bottom-1 right-1 text-xs bg-black bg-opacity-50 text-white px-1 rounded opacity-50">
          Drag to move • Ctrl+Scroll to resize {isDragging ? '(DRAGGING)' : ''}
        </div>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="bg-[#FFFAE2] p-12 rounded-xl text-center w-96 min-h-[320px] shadow-lg font-sans relative z-10">

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
        
        <div className="mt-12">
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