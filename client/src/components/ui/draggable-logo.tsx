import { useState, useRef, useEffect } from "react";
import logoImage from "@assets/Adsız tasarım (7)_1750526968764.png";

interface DraggableLogoProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

export function DraggableLogo({
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 800, height: 533 },
  onPositionChange,
  onSizeChange,
}: DraggableLogoProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  
  const logoRef = useRef<HTMLDivElement>(null);

  // Handle mouse move for dragging and wheel for resizing
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
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };



    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === logoRef.current || (e.target as HTMLElement).closest('.logo-image')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };



  const resetPosition = () => {
    const newPosition = { x: 50, y: 50 };
    const newSize = { width: 800, height: 533 };
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
      onMouseLeave={() => !isDragging && setShowControls(false)}
    >
      {/* Logo Image */}
      <img
        src={logoImage}
        alt="Cash or Crash Logo"
        className="logo-image w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
      
      {/* Size and Position Info - shows when hovering */}
      {showControls && (
        <div className="absolute -bottom-8 left-0 text-xs bg-black bg-opacity-75 text-white px-2 py-1 rounded whitespace-nowrap">
          {Math.round(position.x)}, {Math.round(position.y)} | {Math.round(size.width)}×{Math.round(size.height)}
          <div className="text-[10px] opacity-75 mt-1">Fixed size</div>
        </div>
      )}
    </div>
  );
}