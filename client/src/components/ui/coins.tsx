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
  const getDefaultCoins = () => [
    { id: 1, x: 50, y: 350, size: 60, rotation: 0, selected: false },
    { id: 2, x: 150, y: 370, size: 60, rotation: 0, selected: false },
    { id: 3, x: 250, y: 390, size: 60, rotation: 0, selected: false },
    { id: 4, x: 50, y: 450, size: 60, rotation: 0, selected: false },
    { id: 5, x: 150, y: 470, size: 60, rotation: 0, selected: false },
    { id: 6, x: 250, y: 490, size: 60, rotation: 0, selected: false },
  ];

  const [coins, setCoins] = useState<Coin[]>(() => {
    // Load saved positions or use defaults
    const savedCoins = localStorage.getItem('coins-data');
    if (savedCoins) {
      const parsed = JSON.parse(savedCoins);
      // Check if any coins are in the logo area (x: 229-1029, y: -70-463)
      const hasCoinsUnderLogo = parsed.some((coin: Coin) => 
        coin.x >= 229 && coin.x <= 1029 && coin.y >= -70 && coin.y <= 463
      );
      
      if (hasCoinsUnderLogo) {
        // Reset to new positions if coins are under logo
        localStorage.setItem('coins-data', JSON.stringify(getDefaultCoins()));
        return getDefaultCoins();
      }
      
      return parsed;
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
    if (e.ctrlKey) {
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
          title={`Coin ${coin.id} - Drag to move, Ctrl+scroll to resize, R/E to rotate`}
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