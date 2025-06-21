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
    // Only allow selection, no dragging
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
    // Coins are now fixed - no dragging functionality

    // Coins are now fixed in place - no keyboard controls needed
  }, []);

  return (
    <>
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="fixed z-40 select-none pointer-events-none"
          style={{
            left: `${coin.x}px`,
            top: `${coin.y}px`,
            width: `${coin.size}px`,
            height: `${coin.size}px`,
            transform: `rotate(${coin.rotation}deg)`,
          }}
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