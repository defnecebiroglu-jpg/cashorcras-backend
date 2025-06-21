import { useState, useEffect } from "react";
import { Settings, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DraggableLogo } from "./draggable-logo";

interface LogoSettings {
  visible: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  opacity: number;
}

export function LogoManager() {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<LogoSettings>(() => {
    const saved = localStorage.getItem("logoSettings");
    return saved ? JSON.parse(saved) : {
      visible: true,
      position: { x: 229, y: -200 },
      size: { width: 800, height: 533 },
      opacity: 100,
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("logoSettings", JSON.stringify(settings));
  }, [settings]);

  const updatePosition = (position: { x: number; y: number }) => {
    setSettings(prev => ({ ...prev, position }));
  };

  const updateSize = (size: { width: number; height: number }) => {
    setSettings(prev => ({ ...prev, size }));
  };

  const updateOpacity = (opacity: number[]) => {
    setSettings(prev => ({ ...prev, opacity: opacity[0] }));
  };

  const toggleVisibility = () => {
    setSettings(prev => ({ ...prev, visible: !prev.visible }));
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      visible: true,
      position: { x: 229, y: -200 },
      size: { width: 800, height: 533 },
      opacity: 100,
    };
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Logo Settings Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
        onClick={() => setShowSettings(!showSettings)}
      >
        <Settings className="h-4 w-4 mr-2" />
        Logo
      </Button>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="fixed top-16 left-4 z-50 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Logo Controls
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="logo-visible" className="flex items-center gap-2">
                {settings.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                Show Logo
              </Label>
              <Switch
                id="logo-visible"
                checked={settings.visible}
                onCheckedChange={toggleVisibility}
              />
            </div>

            {/* Opacity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Opacity</Label>
                <span className="text-sm text-muted-foreground">{settings.opacity}%</span>
              </div>
              <Slider
                value={[settings.opacity]}
                onValueChange={updateOpacity}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            {/* Status */}
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
              <strong>Logo Status:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Fixed at position 229, -200</li>
                <li>• Fixed size: 800×533 pixels</li>
                <li>• Cannot be moved or resized</li>
                <li>• Use visibility toggle above to show/hide</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Draggable Logo */}
      {settings.visible && (
        <div style={{ opacity: settings.opacity / 100 }}>
          <DraggableLogo
            initialPosition={settings.position}
            initialSize={settings.size}
            onPositionChange={updatePosition}
            onSizeChange={updateSize}
          />
        </div>
      )}
    </>
  );
}