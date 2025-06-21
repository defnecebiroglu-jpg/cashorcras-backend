import logoImage from "@assets/Adsız tasarım (7)_1750526968764.png";

interface FixedLogoProps {
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export function FixedLogo({
  position = { x: 50, y: 50 },
  size = { width: 150, height: 100 },
}: FixedLogoProps) {
  return (
    <div
      className="fixed z-50 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
    >
      <img
        src={logoImage}
        alt="Cash or Crash Logo"
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
}