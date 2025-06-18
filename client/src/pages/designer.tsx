import { AppDesigner } from "@/components/designer/app-designer";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Designer() {
  const [, setLocation] = useLocation();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Quick Navigation */}
      <div className="bg-card border-b border-border px-4 py-2 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>
        <ThemeToggle />
      </div>

      {/* App Designer Content */}
      <div className="flex-1">
        <AppDesigner />
      </div>
    </div>
  );
}