import { useState, useRef } from "react";
import coinImage from "@assets/C (2) 5 (2)_1750529353646.png";

interface SimpleCoinProps {
  id: number;
}

function SimpleCoin({ id }: SimpleCoinProps) {
  const [position, setPosition] = useState({ x: 100 + id * 80, y: 100 + id * 50 });
  const [size, setSize] = useState(60);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  
  const coinRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsSelected(true);
    
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const newSize = e.deltaY > 0 ? Math.max(20, size - 5) : Math.min(150, size + 5);
      setSize(newSize);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isSelected) {
      if (e.key.toLowerCase() === 'r') {
        setRotation((prev) => (prev + 15) % 360);
      } else if (e.key.toLowerCase() === 'e') {
        setRotation((prev) => (prev - 15 + 360) % 360);
      }
    }
  };

  return (
    <div
      ref={coinRef}
      className={`fixed z-40 cursor-grab ${isDragging ? 'cursor-grabbing' : ''} ${
        isSelected ? 'ring-2 ring-yellow-400 ring-opacity-70' : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <img
        src={coinImage}
        alt={`Coin ${id}`}
        className="w-full h-full object-contain select-none"
        draggable={false}
      />
    </div>
  );
}

export function SimpleCoins() {
  return (
    <div>
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <SimpleCoin key={id} id={id} />
      ))}
    </div>
  );
}