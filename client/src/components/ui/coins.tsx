import { useState, useEffect } from "react";
import coinImage from "@assets/C (2) 5 (2)_1750529353646.png";

interface Coin {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  selected: boolean;
}

export function Coins() {
  // Function to capture current state as new defaults
  const captureCurrentAsDefaults = () => {
    const currentCoins = localStorage.getItem('coins-data');
    if (currentCoins) {
      const parsed = JSON.parse(currentCoins);
      console.log('Current coin configuration captured as defaults:', parsed);
      return parsed;
    }
    return [
      { id: 1, x: 1100, y: 100, size: 60, rotation: 0, selected: false },
      { id: 2, x: 1200, y: 100, size: 60, rotation: 0, selected: false },
      { id: 3, x: 1300, y: 100, size: 60, rotation: 0, selected: false },
      { id: 4, x: 1100, y: 200, size: 60, rotation: 0, selected: false },
      { id: 5, x: 1200, y: 200, size: 60, rotation: 0, selected: false },
      { id: 6, x: 1300, y: 200, size: 60, rotation: 0, selected: false },
    ];
  };

  const getDefaultCoins = captureCurrentAsDefaults;

  const [coins, setCoins] = useState<Coin[]>(() => {
    // Load current positions and fix them as defaults
    const savedCoins = localStorage.getItem('coins-data');
    if (savedCoins) {
      return JSON.parse(savedCoins);
    }
    return getDefaultCoins();
  });
  
  const [draggedCoin, setDraggedCoin] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Save coins to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('coins-data', JSON.stringify(coins));
  }, [coins]);

  const handleCoinMouseDown = (e: React.MouseEvent, coinId: number) => {
    e.preventDefault();
    setDraggedCoin(coinId);
    setDragOffset({
      x: e.clientX - coins.find(c => c.id === coinId)!.x,
      y: e.clientY - coins.find(c => c.id === coinId)!.y,
    });
    
    setCoins(prevCoins => 
      prevCoins.map(coin => ({ ...coin, selected: coin.id === coinId }))
    );
  };

  const handleCoinWheel = (e: React.WheelEvent, coinId: number) => {
    if (e.shiftKey) {
      e.preventDefault();
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setCoins(prevCoins =>
        prevCoins.map(coin =>
          coin.id === coinId
            ? { ...coin, size: Math.max(20, Math.min(200, coin.size * scaleFactor)) }
            : coin
        )
      );
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedCoin !== null) {
        setCoins(prevCoins =>
          prevCoins.map(coin =>
            coin.id === draggedCoin
              ? { ...coin, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
              : coin
          )
        );
      }
    };

    const handleMouseUp = () => {
      setDraggedCoin(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedCoin = coins.find(c => c.selected);
      if (selectedCoin) {
        if (e.key.toLowerCase() === 'r') {
          setCoins(prevCoins =>
            prevCoins.map(coin =>
              coin.selected ? { ...coin, rotation: (coin.rotation + 15) % 360 } : coin
            )
          );
        } else if (e.key.toLowerCase() === 'e') {
          setCoins(prevCoins =>
            prevCoins.map(coin =>
              coin.selected ? { ...coin, rotation: (coin.rotation - 15 + 360) % 360 } : coin
            )
          );
        } else if (e.key === '+' || e.key === '=') {
          setCoins(prevCoins =>
            prevCoins.map(coin =>
              coin.selected ? { ...coin, size: Math.min(200, coin.size + 5) } : coin
            )
          );
        } else if (e.key === '-') {
          setCoins(prevCoins =>
            prevCoins.map(coin =>
              coin.selected ? { ...coin, size: Math.max(20, coin.size - 5) } : coin
            )
          );
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [draggedCoin, dragOffset, coins]);

  return (
    <>
      {coins.map((coin) => (
        <div
          key={coin.id}
          className={`fixed z-40 cursor-grab select-none ${
            coin.selected ? 'ring-2 ring-yellow-400 ring-opacity-70' : ''
          } hover:scale-105 transition-transform`}
          style={{
            left: `${coin.x}px`,
            top: `${coin.y}px`,
            width: `${coin.size}px`,
            height: `${coin.size}px`,
            transform: `rotate(${coin.rotation}deg)`,
          }}
          onMouseDown={(e) => handleCoinMouseDown(e, coin.id)}
          onWheel={(e) => handleCoinWheel(e, coin.id)}
          title={`Coin ${coin.id} - Drag to move, Shift+scroll or +/- keys to resize, R/E to rotate`}
        >
          <img
            src={coinImage}
            alt={`Coin ${coin.id}`}
            className="w-full h-full object-contain pointer-events-none drop-shadow-lg"
            draggable={false}
          />
        </div>
      ))}
    </>
  );
}