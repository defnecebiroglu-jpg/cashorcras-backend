import { useState } from "react";
import { AppDesigner } from "@/components/designer/app-designer";
import { FrameInspector } from "@/components/designer/frame-inspector";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft, Search, Paintbrush } from "lucide-react";
import { useLocation } from "wouter";

export default function Designer() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'inspect' | 'design'>('inspect');

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Navigation Header */}
      <div className="bg-card border-b border-border px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant={mode === 'inspect' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('inspect')}
            >
              <Search className="h-4 w-4 mr-2" />
              Inspect Frames
            </Button>
            <Button
              variant={mode === 'design' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('design')}
            >
              <Paintbrush className="h-4 w-4 mr-2" />
              Design Mode
            </Button>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="flex-1">
        {mode === 'inspect' ? <FrameInspector /> : <AppDesigner />}
      </div>
    </div>
  );
}