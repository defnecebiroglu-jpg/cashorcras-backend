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
  // Fixed responsive positions that work across screen modes
  const getResponsiveCoins = () => [
    { id: 1, x: 75, y: 15, size: 60, rotation: 0, selected: false }, // Top row
    { id: 2, x: 82, y: 15, size: 60, rotation: 0, selected: false },
    { id: 3, x: 89, y: 15, size: 60, rotation: 0, selected: false },
    { id: 4, x: 75, y: 25, size: 60, rotation: 0, selected: false }, // Bottom row
    { id: 5, x: 82, y: 25, size: 60, rotation: 0, selected: false },
    { id: 6, x: 89, y: 25, size: 60, rotation: 0, selected: false },
  ];

  const [coins] = useState<Coin[]>(getResponsiveCoins);

  return (
    <>
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="fixed z-40 select-none pointer-events-none"
          style={{
            left: `${coin.x}vw`,
            top: `${coin.y}vh`,
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