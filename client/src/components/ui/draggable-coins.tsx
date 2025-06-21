import { useState, useRef, useEffect } from "react";
import coinImage from "@assets/C (2) 5 (2)_1750529353646.png";

interface DraggableCoinProps {
  id: number;
}

export function DraggableCoin({ id }: DraggableCoinProps) {
  const [position, setPosition] = useState({ x: 200 + id * 70, y: 200 + id * 40 });
  const [size, setSize] = useState({ width: 60, height: 60 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const coinRef = useRef<HTMLDivElement>(null);

  // Load saved values from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem(`coin-${id}-position`);
    const savedSize = localStorage.getItem(`coin-${id}-size`);
    const savedRotation = localStorage.getItem(`coin-${id}-rotation`);
    
    if (savedPosition) setPosition(JSON.parse(savedPosition));
    if (savedSize) setSize(JSON.parse(savedSize));
    if (savedRotation) setRotation(JSON.parse(savedRotation));
  }, [id]);

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        };
        setPosition(newPosition);
        localStorage.setItem(`coin-${id}-position`, JSON.stringify(newPosition));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, id]);

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
          
          const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
          const newSize = {
            width: Math.max(20, Math.min(200, size.width * scaleFactor)),
            height: Math.max(20, Math.min(200, size.height * scaleFactor)),
          };
          setSize(newSize);
          localStorage.setItem(`coin-${id}-size`, JSON.stringify(newSize));
        }
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
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

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, rotation, id]);

  // Handle selection/deselection
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (coinRef.current && !coinRef.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  return (
    <div
      ref={coinRef}
      className={`fixed z-40 select-none cursor-grab ${
        isDragging ? 'cursor-grabbing' : ''
      } ${isSelected ? 'ring-2 ring-yellow-400' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: `rotate(${rotation}deg)`,
        transition: isDragging ? 'none' : 'transform 0.1s ease',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <img
        src={coinImage}
        alt={`Coin ${id}`}
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
      
      {showInfo && (
        <div className="absolute -bottom-16 left-0 text-xs bg-black bg-opacity-80 text-white px-2 py-1 rounded whitespace-nowrap z-50">
          <div>Pos: {position.x}, {position.y}</div>
          <div>Size: {Math.round(size.width)}×{Math.round(size.height)}</div>
          <div>Rotation: {rotation}°</div>
          <div className="text-[10px] opacity-75 mt-1">
            Drag: move | Ctrl+scroll: resize | R/E: rotate
          </div>
        </div>
      )}
    </div>
  );
}

// Component to render all 6 coins
export function DraggableCoins() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <DraggableCoin key={`coin-${id}`} id={id} />
      ))}
    </>
  );
}