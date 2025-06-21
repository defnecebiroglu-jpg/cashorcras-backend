import { useState, useRef, useEffect } from "react";
import coinImage from "@assets/C (2) 5 (2)_1750528826418.png";

interface CoinInstance {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isDragging: boolean;
  dragStart: { x: number; y: number };
}

interface DraggableCoinsProps {
  onCoinsChange?: (coins: CoinInstance[]) => void;
}

export function DraggableCoins({ onCoinsChange }: DraggableCoinsProps) {
  const [coins, setCoins] = useState<CoinInstance[]>(() => {
    // Initialize 6 coins with different positions
    return Array.from({ length: 6 }, (_, i) => ({
      id: `coin-${i}`,
      position: { 
        x: 100 + (i % 3) * 150, 
        y: 100 + Math.floor(i / 3) * 150 
      },
      size: { width: 80, height: 80 },
      isDragging: false,
      dragStart: { x: 0, y: 0 }
    }));
  });

  const coinsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoins(prevCoins => 
        prevCoins.map(coin => {
          if (coin.isDragging) {
            const newPosition = {
              x: e.clientX - coin.dragStart.x,
              y: e.clientY - coin.dragStart.y,
            };
            return { ...coin, position: newPosition };
          }
          return coin;
        })
      );
    };

    const handleMouseUp = () => {
      setCoins(prevCoins => 
        prevCoins.map(coin => ({ ...coin, isDragging: false }))
      );
    };

    const isDragging = coins.some(coin => coin.isDragging);
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [coins]);

  // Handle mouse down for starting drag
  const handleMouseDown = (coinId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const coin = coins.find(c => c.id === coinId);
    if (!coin) return;

    const rect = coinsRef.current[coinId]?.getBoundingClientRect();
    if (!rect) return;

    const dragStart = {
      x: e.clientX - coin.position.x,
      y: e.clientY - coin.position.y,
    };

    setCoins(prevCoins =>
      prevCoins.map(c =>
        c.id === coinId
          ? { ...c, isDragging: true, dragStart }
          : c
      )
    );
  };

  // Handle wheel event for resizing with Ctrl key
  const handleWheel = (coinId: string, e: React.WheelEvent) => {
    if (!e.ctrlKey) return;
    e.preventDefault();

    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    
    setCoins(prevCoins =>
      prevCoins.map(coin => {
        if (coin.id === coinId) {
          const newWidth = Math.max(20, Math.min(300, coin.size.width * scaleFactor));
          const newHeight = Math.max(20, Math.min(300, coin.size.height * scaleFactor));
          return {
            ...coin,
            size: { width: newWidth, height: newHeight }
          };
        }
        return coin;
      })
    );
  };

  // Notify parent of changes
  useEffect(() => {
    onCoinsChange?.(coins);
  }, [coins, onCoinsChange]);

  return (
    <>
      {coins.map((coin) => (
        <div
          key={coin.id}
          ref={el => coinsRef.current[coin.id] = el}
          className={`fixed z-40 select-none transition-shadow duration-200 hover:shadow-lg ${
            coin.isDragging ? 'cursor-grabbing shadow-xl ring-2 ring-blue-400' : 'cursor-grab'
          }`}
          style={{
            left: `${coin.position.x}px`,
            top: `${coin.position.y}px`,
            width: `${coin.size.width}px`,
            height: `${coin.size.height}px`,
          }}
          onMouseDown={(e) => handleMouseDown(coin.id, e)}
          onWheel={(e) => handleWheel(coin.id, e)}
        >
          <img
            src={coinImage}
            alt={`Coin ${coin.id}`}
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
          
          {/* Resize hint */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
            Ctrl + Scroll to resize
          </div>
        </div>
      ))}
    </>
  );
}