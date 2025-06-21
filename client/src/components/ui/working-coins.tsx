import { useState, useRef, useEffect } from "react";
import coinImage from "@assets/C (2) 5 (2)_1750529353646.png";

interface WorkingCoinProps {
  id: number;
}

function WorkingCoin({ id }: WorkingCoinProps) {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem(`coin-${id}-position`);
    return saved ? JSON.parse(saved) : { x: 150 + id * 80, y: 150 + id * 50 };
  });
  
  const [size, setSize] = useState(() => {
    const saved = localStorage.getItem(`coin-${id}-size`);
    return saved ? JSON.parse(saved) : 60;
  });
  
  const [rotation, setRotation] = useState(() => {
    const saved = localStorage.getItem(`coin-${id}-rotation`);
    return saved ? JSON.parse(saved) : 0;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const coinRef = useRef<HTMLDivElement>(null);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSelected(true);
    setIsDragging(true);
    
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newPosition = {
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      };
      setPosition(newPosition);
      localStorage.setItem(`coin-${id}-position`, JSON.stringify(newPosition));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle click selection
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  // Handle deselection when clicking elsewhere
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (coinRef.current && !coinRef.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Handle resizing with Ctrl+scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if ((e.ctrlKey || e.metaKey) && coinRef.current) {
        const rect = coinRef.current.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
          e.preventDefault();
          e.stopPropagation();
          
          const scaleFactor = e.deltaY > 0 ? 0.95 : 1.05;
          const newSize = Math.max(20, Math.min(200, size * scaleFactor));
          setSize(newSize);
          localStorage.setItem(`coin-${id}-size`, JSON.stringify(newSize));
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, [size, id]);

  // Handle rotation with R/E keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSelected) {
        let newRotation = rotation;
        
        if (e.key.toLowerCase() === 'r') {
          newRotation = (rotation + 15) % 360;
        } else if (e.key.toLowerCase() === 'e') {
          newRotation = (rotation - 15 + 360) % 360;
        }
        
        if (newRotation !== rotation) {
          setRotation(newRotation);
          localStorage.setItem(`coin-${id}-rotation`, JSON.stringify(newRotation));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, rotation, id]);

  return (
    <div
      ref={coinRef}
      className={`fixed z-40 cursor-grab select-none ${
        isDragging ? 'cursor-grabbing' : ''
      } ${isSelected ? 'ring-2 ring-yellow-400 ring-opacity-80' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.2s ease',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <img
        src={coinImage}
        alt={`Coin ${id}`}
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
      />
      
      {showInfo && (
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-xs bg-black bg-opacity-90 text-white px-3 py-2 rounded-lg whitespace-nowrap z-50 pointer-events-none">
          <div className="text-center">
            <div>Position: {Math.round(position.x)}, {Math.round(position.y)}</div>
            <div>Size: {Math.round(size)}px</div>
            <div>Rotation: {rotation}°</div>
            <div className="text-[10px] opacity-70 mt-1 border-t border-gray-600 pt-1">
              Drag • Ctrl+Scroll: resize • R/E: rotate
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function WorkingCoins() {
  console.log("WorkingCoins component rendering");
  
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <WorkingCoin key={`working-coin-${id}`} id={id} />
      ))}
    </>
  );
}