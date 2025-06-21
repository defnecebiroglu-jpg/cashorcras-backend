import { useState, useRef, useEffect } from "react";
import { Grip, Move, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/Adsız tasarım (7)_1750526968764.png";

interface DraggableLogoProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

export function DraggableLogo({
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 150, height: 100 },
  onPositionChange,
  onSizeChange,
}: DraggableLogoProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showControls, setShowControls] = useState(false);
  
  const logoRef = useRef<HTMLDivElement>(null);

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        };
        setPosition(newPosition);
        onPositionChange?.(newPosition);
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newSize = {
          width: Math.max(50, resizeStart.width + deltaX),
          height: Math.max(33, resizeStart.height + deltaY),
        };
        setSize(newSize);
        onSizeChange?.(newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === logoRef.current || (e.target as HTMLElement).closest('.logo-image')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  const resetPosition = () => {
    const newPosition = { x: 50, y: 50 };
    const newSize = { width: 150, height: 100 };
    setPosition(newPosition);
    setSize(newSize);
    onPositionChange?.(newPosition);
    onSizeChange?.(newSize);
  };

  return (
    <div
      ref={logoRef}
      className={`fixed z-50 select-none transition-shadow duration-200 ${
        showControls ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isDragging && !isResizing && setShowControls(false)}
    >
      {/* Logo Image */}
      <img
        src={logoImage}
        alt="Cash or Crash Logo"
        className="logo-image w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
      
      {/* Control Buttons */}
      {showControls && (
        <div className="absolute -top-10 left-0 flex gap-1 bg-white dark:bg-gray-800 rounded-md shadow-md p-1 border">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setShowControls(false)}
            title="Hide controls"
          >
            <Move className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={resetPosition}
            title="Reset position and size"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {/* Resize Handle */}
      {showControls && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-75 hover:opacity-100"
          onMouseDown={handleResizeMouseDown}
          title="Drag to resize"
        >
          <Grip className="h-3 w-3 text-white" />
        </div>
      )}
      
      {/* Size and Position Info */}
      {showControls && (
        <div className="absolute -bottom-8 left-0 text-xs bg-black bg-opacity-75 text-white px-2 py-1 rounded whitespace-nowrap">
          {Math.round(position.x)}, {Math.round(position.y)} | {Math.round(size.width)}×{Math.round(size.height)}
        </div>
      )}
    </div>
  );
}