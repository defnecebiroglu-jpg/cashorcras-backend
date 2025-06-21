import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FixedLogo } from "./draggable-logo";

export function LogoManager() {
  const [visible, setVisible] = useState(() => {
    const saved = localStorage.getItem("logoVisible");
    return saved ? JSON.parse(saved) : true;
  });

  // Save visibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("logoVisible", JSON.stringify(visible));
  }, [visible]);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <>
      {/* Simple Logo Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
        onClick={toggleVisibility}
      >
        {visible ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
        Logo
      </Button>

      {/* Fixed Logo */}
      {visible && (
        <FixedLogo
          position={{ x: 50, y: 50 }}
          size={{ width: 150, height: 100 }}
        />
      )}
    </>
  );
}