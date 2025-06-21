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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  
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

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    // Add wheel listener to the document
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [isDragging, dragStart, size, id]);

  // Load saved position and size from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem(`coin-${id}-position`);
    const savedSize = localStorage.getItem(`coin-${id}-size`);
    
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
    if (savedSize) {
      setSize(JSON.parse(savedSize));
    }
  }, [id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === coinRef.current || (e.target as HTMLElement).closest('.coin-image')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  return (
    <div
      ref={coinRef}
      className={`fixed z-40 select-none transition-all duration-200 ${
        showControls ? 'drop-shadow-lg' : ''
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
      {/* Coin Image */}
      <img
        src={coinImage}
        alt={`Coin ${id}`}
        className="coin-image w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
      
      {/* Size and Position Info - shows when hovering */}
      {showControls && (
        <div className="absolute -bottom-8 left-0 text-xs bg-black bg-opacity-75 text-white px-2 py-1 rounded whitespace-nowrap">
          {Math.round(position.x)}, {Math.round(position.y)} | {Math.round(size.width)}×{Math.round(size.height)}
          <div className="text-[10px] opacity-75 mt-1">Ctrl+scroll to resize</div>
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