import coinImage from "@assets/C (2) 5 (2)_1750529353646.png";

export function TestCoins() {
  console.log("TestCoins component rendering");
  console.log("Coin image path:", coinImage);
  
  return (
    <div className="fixed top-20 left-20 z-50">
      <div className="bg-red-500 text-white p-2 text-sm">
        TEST COINS LOADED
      </div>
      {[1, 2, 3].map((id) => (
        <div
          key={id}
          className="fixed bg-yellow-300 rounded-full cursor-pointer border-2 border-yellow-600"
          style={{
            left: `${100 + id * 80}px`,
            top: `${100 + id * 50}px`,
            width: '60px',
            height: '60px',
          }}
          onClick={() => console.log(`Coin ${id} clicked`)}
        >
          <img
            src={coinImage}
            alt={`Test Coin ${id}`}
            className="w-full h-full object-contain"
            onLoad={() => console.log(`Coin ${id} image loaded`)}
            onError={() => console.log(`Coin ${id} image failed to load`)}
          />
        </div>
      ))}
    </div>
  );
}