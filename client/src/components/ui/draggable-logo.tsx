import { useState, useRef, useEffect } from "react";
import logoImage from "@assets/Adsız tasarım (7)_1750526968764.png";

interface DraggableLogoProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
}

export function DraggableLogo({
  initialPosition = { x: 229, y: -70 },
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

  // Logo is now fixed in position - no dragging allowed



  const resetPosition = () => {
    const newPosition = { x: 229, y: -70 };
    const newSize = { width: 800, height: 533 };
    setPosition(newPosition);
    setSize(newSize);
    onPositionChange?.(newPosition);
    onSizeChange?.(newSize);
  };

  return (
    <div
      ref={logoRef}
      className={`fixed z-40 select-none transition-shadow duration-200 ${
        showControls ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: 'default',
      }}
    >
      {/* Logo Image - Fixed Position */}
      <img
        src={logoImage}
        alt="Cash or Crash Logo"
        className="logo-image w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
    </div>
  );
}