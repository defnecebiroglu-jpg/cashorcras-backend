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
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#FFF5AD",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 50 }}>
        <ThemeToggle />
      </div>
      
      {/* Background decorative images */}
      <div style={{ position: "absolute", top: "20px", left: "20px", width: "419.21px", height: "429.09px", transform: "rotate(-30deg)", transformOrigin: "top left", opacity: 0.3 }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fde047, #facc15)", borderRadius: "50%" }}></div>
      </div>
      <div style={{ position: "absolute", top: "40px", right: "20px", width: "370.65px", height: "348.75px", transform: "rotate(100deg)", transformOrigin: "top left", opacity: 0.3 }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fb923c, #f97316)", borderRadius: "50%" }}></div>
      </div>
      <div style={{ position: "absolute", bottom: "40px", left: "40px", width: "545.19px", height: "523.53px", transform: "rotate(110deg)", transformOrigin: "top left", opacity: 0.3 }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #eab308, #ca8a04)", borderRadius: "50%" }}></div>
      </div>
      <div style={{ position: "absolute", bottom: "20px", right: "40px", width: "589.60px", height: "589.60px", transform: "rotate(-45deg)", transformOrigin: "top left", opacity: 0.3 }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", borderRadius: "50%" }}></div>
      </div>
      <div style={{ position: "absolute", top: "60px", left: "60px", width: "333.41px", height: "354.34px", transform: "rotate(-10deg)", transformOrigin: "top left", opacity: 0.3 }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fde047, #facc15)", borderRadius: "50%" }}></div>
      </div>
      <div style={{ position: "absolute", bottom: "60px", right: "60px", width: "388.18px", height: "372.75px", transform: "rotate(70deg)", transformOrigin: "top left", opacity: 0.3 }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #fb923c, #f97316)", borderRadius: "50%" }}></div>
      </div>

      {/* Main content */}
      <div style={{ 
        zIndex: 10, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "32px"
      }}>
        
        {/* Main image */}
        <div style={{
          width: "679px",
          height: "581px",
          background: "linear-gradient(135deg, #eab308, #ca8a04)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
        }}>
          <div style={{
            width: "182px",
            height: "182px",
            position: "relative",
            boxShadow: "inset 0px 4px 4px #B18F13",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #facc15, #eab308)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{ fontSize: "72px", fontWeight: "bold", color: "white" }}>₺</div>
          </div>
        </div>

        {/* Title */}
        <div style={{ 
          textAlign: "center", 
          color: "#E4B300", 
          fontSize: "53.45px", 
          fontFamily: "Jockey One, system-ui, sans-serif", 
          fontWeight: 400, 
          lineHeight: "70.55px"
        }}>
          TAKIM GİRİŞİ
        </div>

        {/* Access code label */}
        <div style={{ 
          color: "#BD9E2C", 
          fontSize: "36px", 
          fontFamily: "Mukta, system-ui, sans-serif", 
          fontWeight: 400, 
          lineHeight: "47.52px"
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
              width: "400px",
              height: "60px",
              fontSize: "24px",
              padding: "0 16px",
              border: "2px solid #BD9E2C",
              borderRadius: "8px",
              background: "white",
              outline: "none"
            }}
          />

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading || !accessCode.trim()}
            style={{ 
              width: "400px",
              height: "60px",
              textAlign: "center", 
              color: "#927201", 
              fontSize: "36px", 
              fontFamily: "Mukta, system-ui, sans-serif", 
              fontWeight: 400, 
              lineHeight: "47.52px",
              background: "white",
              border: "2px solid #BD9E2C",
              borderRadius: "8px",
              cursor: isLoading || !accessCode.trim() ? "not-allowed" : "pointer"
            }}
          >
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        {/* Admin login link */}
        <div style={{ 
          textAlign: "center",
          fontSize: "36px", 
          fontFamily: "Sulphur Point, system-ui, sans-serif", 
          fontWeight: 700, 
          lineHeight: "47.52px"
        }}>
          <span style={{ color: "#BF9E27" }}>Admin girişi için </span>
          <button 
            onClick={() => setLocation("/admin-login")}
            style={{ 
              color: "#927201", 
              background: "none", 
              border: "none", 
              fontSize: "inherit",
              fontFamily: "inherit",
              fontWeight: "inherit",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            buraya tıklayınız.
          </button>
        </div>
      </div>
    </div>
  );
}