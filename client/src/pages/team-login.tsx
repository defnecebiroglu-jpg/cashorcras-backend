import { useState } from "react";
import { useLocation } from "wouter";
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
    <>
      {/* Background container */}
      <div style={{ width: "1900px", height: "1066px", background: "#FFF5AD", position: "fixed", top: 0, left: 0, zIndex: -1 }}></div>
      
      {/* Theme toggle */}
      <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 1000 }}>
        <ThemeToggle />
      </div>

      {/* Background decorative image */}
      <div style={{ 
        position: "absolute", 
        top: "100px", 
        right: "100px",
        width: "333.41px", 
        height: "354.34px", 
        transform: "rotate(-10deg)", 
        transformOrigin: "top left",
        zIndex: 1
      }}>
        <div style={{ 
          width: "100%", 
          height: "100%", 
          background: "linear-gradient(135deg, #fde047, #facc15)", 
          borderRadius: "50%",
          opacity: 0.4
        }}></div>
      </div>

      {/* Main content container */}
      <div style={{
        minHeight: "100vh",
        background: "#FFF5AD",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        gap: "40px",
        position: "relative",
        zIndex: 10
      }}>
        
        {/* Main image */}
        <div style={{ width: "679px", height: "581px", background: "linear-gradient(135deg, #eab308, #ca8a04)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: "120px", color: "white", fontWeight: "bold" }}>₺</div>
        </div>

        {/* Title */}
        <div style={{ 
          textAlign: "center", 
          color: "#E4B300", 
          fontSize: "53.45px", 
          fontFamily: "Jockey One", 
          fontWeight: 400, 
          lineHeight: "70.55px", 
          wordWrap: "break-word" 
        }}>
          TAKIM GİRİŞİ
        </div>

        {/* Access code prompt */}
        <div style={{ 
          width: "600px", 
          color: "#BD9E2C", 
          fontSize: "36px", 
          fontFamily: "Mukta", 
          fontWeight: 400, 
          lineHeight: "47.52px", 
          wordWrap: "break-word",
          textAlign: "center"
        }}>
          Erişim kodunu giriniz.
        </div>

        {/* Input field */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            required
            style={{
              width: "500px",
              height: "60px",
              fontSize: "28px",
              padding: "0 20px",
              border: "3px solid #BD9E2C",
              borderRadius: "8px",
              background: "white",
              outline: "none",
              textAlign: "center"
            }}
          />

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading || !accessCode.trim()}
            style={{ 
              width: "500px",
              height: "70px",
              textAlign: "center", 
              color: "#927201", 
              fontSize: "36px", 
              fontFamily: "Mukta", 
              fontWeight: 400, 
              lineHeight: "47.52px", 
              wordWrap: "break-word",
              background: "white",
              border: "3px solid #BD9E2C",
              borderRadius: "8px",
              cursor: isLoading || !accessCode.trim() ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        {/* Admin login link */}
        <div style={{ 
          width: "800px", 
          textAlign: "center"
        }}>
          <span style={{ 
            color: "#BF9E27", 
            fontSize: "36px", 
            fontFamily: "Sulphur Point", 
            fontWeight: 700, 
            lineHeight: "47.52px", 
            wordWrap: "break-word" 
          }}>
            Admin girişi için 
          </span>
          <button 
            onClick={() => setLocation("/admin-login")}
            style={{ 
              color: "#927201", 
              fontSize: "36px", 
              fontFamily: "Sulphur Point", 
              fontWeight: 700, 
              lineHeight: "47.52px", 
              wordWrap: "break-word",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            buraya tıklayınız.
          </button>
        </div>
      </div>
    </>
  );
}