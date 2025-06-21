import { useState, useRef, useEffect } from "react";
import coinImage from "@assets/C (2) 5 (2)_1750529353646.png";

interface DraggableCoinProps {
  id: number;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

export function DraggableCoin({
  id,
  initialPosition = { x: 100 + id * 60, y: 100 + id * 60 },
  initialSize = { width: 80, height: 80 },
}: DraggableCoinProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  
  const coinRef = useRef<HTMLDivElement>(null);

  // Handle mouse move for dragging and wheel for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        };
        setPosition(newPosition);
        // Save position to localStorage
        localStorage.setItem(`coin-${id}-position`, JSON.stringify(newPosition));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const rect = coinRef.current?.getBoundingClientRect();
        if (rect) {
          const mouseX = e.clientX;
          const mouseY = e.clientY;
          const coinX = rect.left;
          const coinY = rect.top;
          const coinRight = rect.right;
          const coinBottom = rect.bottom;
          
          // Check if mouse is over the coin
          if (mouseX >= coinX && mouseX <= coinRight && mouseY >= coinY && mouseY <= coinBottom) {
            const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
            const newSize = {
              width: Math.max(20, Math.min(200, size.width * scaleFactor)),
              height: Math.max(20, Math.min(200, size.height * scaleFactor)),
            };
            setSize(newSize);
            // Save size to localStorage
            localStorage.setItem(`coin-${id}-size`, JSON.stringify(newSize));
          }
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSelected) {
        if (e.key === 'r' || e.key === 'R') {
          const newRotation = (rotation + 15) % 360;
          setRotation(newRotation);
          localStorage.setItem(`coin-${id}-rotation`, JSON.stringify(newRotation));
        } else if (e.key === 'e' || e.key === 'E') {
          const newRotation = (rotation - 15 + 360) % 360;
          setRotation(newRotation);
          localStorage.setItem(`coin-${id}-rotation`, JSON.stringify(newRotation));
        }
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    // Add wheel and keyboard listeners
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDragging, dragStart, size, id, isSelected, rotation]);

  // Load saved position, size, and rotation from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem(`coin-${id}-position`);
    const savedSize = localStorage.getItem(`coin-${id}-size`);
    const savedRotation = localStorage.getItem(`coin-${id}-rotation`);
    
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
    if (savedSize) {
      setSize(JSON.parse(savedSize));
    }
    if (savedRotation) {
      setRotation(JSON.parse(savedRotation));
    }
  }, [id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === coinRef.current || (e.target as HTMLElement).closest('.coin-image')) {
      setIsDragging(true);
      setIsSelected(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  // Global click listener to deselect when clicking elsewhere
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!coinRef.current?.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div
      ref={coinRef}
      className={`fixed z-40 select-none transition-all duration-200 ${
        showControls ? 'drop-shadow-lg' : ''
      } ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: `rotate(${rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isDragging && setShowControls(false)}
    >
      {/* Coin Image */}
      <img
        src={coinImage}
        alt={`Coin ${id}`}
        className="coin-image w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
      
      {/* Size and Position Info - shows when hovering */}
      {showControls && (
        <div className="absolute -bottom-12 left-0 text-xs bg-black bg-opacity-75 text-white px-2 py-1 rounded whitespace-nowrap">
          {Math.round(position.x)}, {Math.round(position.y)} | {Math.round(size.width)}×{Math.round(size.height)} | {rotation}°
          <div className="text-[10px] opacity-75 mt-1">
            Ctrl+scroll: resize | R/E: rotate | Click: select
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
        <DraggableCoin key={id} id={id} />
      ))}
    </>
  );
}