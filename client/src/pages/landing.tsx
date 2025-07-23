import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#1B1B1B' }}>
      {/* Header */}
      <header className="w-full px-8 py-8 flex justify-between items-end">
        <div className="text-[#E3DFD6] text-2xl font-bold tracking-wider" style={{ fontFamily: 'Inter', fontWeight: 900 }}>
          KALGIRISIMCILIK
        </div>
        <div className="flex items-end gap-10">
          <div className="text-[#1B1B1B] text-2xl font-bold" style={{ fontFamily: 'Inter', fontWeight: 900 }}>
            HAKKINDA
          </div>
          <Link href="/team-login">
            <button 
              className="h-[50px] px-6 rounded-lg flex items-center justify-center transition-colors hover:opacity-90"
              style={{ background: '#AA95C7' }}
            >
              <div className="text-[#1B1B1B] text-2xl font-bold" style={{ fontFamily: 'Inter', fontWeight: 900 }}>
                GİRİŞ YAP
              </div>
            </button>
          </Link>
        </div>
      </header>

      {/* Main heading */}
      <div className="w-full px-11 mt-8">
        <h1 
          className="text-center text-[#E3DFD6] uppercase leading-[100px]"
          style={{ 
            fontSize: '128px', 
            fontFamily: 'Inter', 
            fontWeight: 900,
            lineHeight: '100px'
          }}
        >
          Kazanmaya cesaretin var mı?
        </h1>
      </div>

      {/* Central image placeholder */}
      <div className="flex justify-center mt-8">
        <div 
          className="bg-gray-300 flex items-center justify-center"
          style={{ width: '1306px', height: '776px' }}
        >
          <div className="text-6xl font-black text-gray-600">
            CASH CRASH!
          </div>
        </div>
      </div>

      {/* Decorative rectangles */}
      <div 
        className="absolute"
        style={{
          width: '260px',
          height: '223px',
          left: '388px',
          top: '741px',
          transform: 'rotate(180deg)',
          outline: '6px #AA95C7 solid',
          outlineOffset: '-3px'
        }}
      ></div>
      <div 
        className="absolute"
        style={{
          width: '260px',
          height: '223px',
          left: '1089px',
          top: '518px',
          outline: '6px #CBED46 solid',
          outlineOffset: '-3px'
        }}
      ></div>

      {/* Quote section */}
      <div 
        className="mx-auto mt-20 px-20 py-20 rounded-[25px] flex justify-between items-center"
        style={{ 
          width: '1364px',
          background: 'rgba(202, 227, 4, 0.90)'
        }}
      >
        <div 
          className="text-[#1B1B1B] uppercase leading-[79px]"
          style={{
            width: '650px',
            fontSize: '96px',
            fontFamily: 'Inter',
            fontWeight: 900,
            lineHeight: '79px'
          }}
        >
          "Bir karar, her şeyi değiştirir."
        </div>
        <div 
          className="text-right text-[#1B1B1B] leading-[40px]"
          style={{
            width: '524px',
            fontSize: '32px',
            fontFamily: 'Inter',
            fontWeight: 600,
            lineHeight: '40px'
          }}
        >
          defnecebiroglu@gmail.com<br/>
          iremcebiroglu@gmail.com<br/>
          eylllllltasirtaon@gmail.com
        </div>
      </div>

      {/* Footer social links */}
      <footer className="flex justify-center items-center gap-96 mt-12 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] overflow-hidden">
            <div className="w-[44px] h-[44px] ml-2 mt-2 bg-[#E3DFD6]"></div>
          </div>
          <div 
            className="text-[#E3DFD6] leading-[40px]"
            style={{
              fontSize: '32px',
              fontFamily: 'Inter',
              fontWeight: 600
            }}
          >
            @kalgirisimcilik_
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-[60px] h-[60px] overflow-hidden">
            <div className="w-[48px] h-[48px] ml-1.5 mt-1.5 bg-[#E3DFD6]"></div>
          </div>
          <div 
            className="text-[#E3DFD6] leading-[40px]"
            style={{
              fontSize: '32px',
              fontFamily: 'Inter',
              fontWeight: 600
            }}
          >
            @kalgirisimcilik
          </div>
        </div>
      </footer>

      {/* Hidden admin access */}
      <Link href="/admin-login">
        <button className="fixed bottom-4 right-4 opacity-20 hover:opacity-60 bg-gray-800 px-3 py-1 rounded text-xs transition-opacity">
          Admin
        </button>
      </Link>
    </div>
  );
}