import { VisualDesigner } from "@/components/designer/visual-designer";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Designer() {
  const [, setLocation] = useLocation();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          <h1 className="text-lg font-semibold">Visual UI Designer</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Designer Content */}
      <div className="flex-1">
        <VisualDesigner />
      </div>
    </div>
  );
}