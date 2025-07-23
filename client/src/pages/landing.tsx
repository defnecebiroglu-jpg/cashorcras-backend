import { Link } from "wouter";

const colors = {
  background: '#1B1B1B',
  textPrimary: '#E3DFD6',
  textSecondary: '#1B1B1B',
  accent: 'rgba(202, 227, 4, 0.90)',
  button: '#AA95C7',
  decorativePurple: '#AA95C7',
  decorativeYellow: '#CBED46'
};

export default function Landing() {
  return (
    <main className="flex flex-row justify-center w-full min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="w-[1440px] h-[1810px] relative" style={{ backgroundColor: colors.background }}>
        
        {/* Header */}
        <header className="flex w-[1440px] items-end justify-between p-8 absolute top-0 left-0">
          <h1 
            className="relative w-fit h-[47px] font-bold text-2xl tracking-wider leading-normal"
            style={{ color: colors.textPrimary, fontFamily: 'Inter', fontWeight: 900 }}
          >
            KALGIRISIMCILIK
          </h1>

          <nav className="flex w-fit items-end gap-10 relative">
            <div 
              className="relative w-fit h-[47px] font-bold text-2xl tracking-[0] leading-normal"
              style={{ color: colors.textSecondary, fontFamily: 'Inter', fontWeight: 900 }}
            >
              HAKKINDA
            </div>

            <Link href="/team-login">
              <button 
                className="h-[50px] px-6 py-0 rounded-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: colors.button }}
              >
                <span 
                  className="font-bold text-2xl text-center tracking-[0] leading-normal"
                  style={{ color: colors.textSecondary, fontFamily: 'Inter', fontWeight: 900 }}
                >
                  GİRİŞ YAP
                </span>
              </button>
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <h2 
          className="absolute w-[1352px] top-[114px] left-[44px] font-bold text-center tracking-[0] uppercase whitespace-normal"
          style={{ 
            color: colors.textPrimary,
            fontFamily: 'Inter',
            fontWeight: 900,
            fontSize: '128px',
            lineHeight: '100px'
          }}
        >
          Kazanmaya cesaretin var mı?
        </h2>

        {/* Main Image/Content Section */}
        <section className="absolute w-[1306px] h-[776px] top-[316px] left-[93px]">
          <div
            className="absolute w-[1306px] h-[776px] top-0 left-0 bg-gray-700 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: '#2a2a2a' }}
          >
            {/* Stylized CASH CRASH logo */}
            <div className="text-center">
              <div 
                className="font-black mb-4"
                style={{ 
                  fontSize: '120px', 
                  color: colors.decorativeYellow,
                  fontFamily: 'Inter',
                  fontWeight: 900,
                  textShadow: '4px 4px 8px rgba(0,0,0,0.8)'
                }}
              >
                CASH
              </div>
              <div 
                className="font-black relative"
                style={{ 
                  fontSize: '120px', 
                  color: colors.decorativeYellow,
                  fontFamily: 'Inter',
                  fontWeight: 900,
                  textShadow: '4px 4px 8px rgba(0,0,0,0.8)'
                }}
              >
                CRASH!
                <span className="absolute -top-4 -right-8 text-6xl">★</span>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative rectangles */}
        <div 
          className="absolute"
          style={{
            width: '260px',
            height: '223px',
            left: '388px',
            top: '741px',
            transform: 'rotate(180deg)',
            outline: `6px ${colors.decorativePurple} solid`,
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
            outline: `6px ${colors.decorativeYellow} solid`,
            outlineOffset: '-3px'
          }}
        ></div>

        {/* Quote Section */}
        <div 
          className="w-[1364px] absolute top-[1109px] left-[38px] rounded-[25px] border-none"
          style={{ backgroundColor: colors.accent }}
        >
          <div className="flex items-start justify-between p-20">
            <blockquote 
              className="relative w-[650px] h-[201px] mt-[-1.00px] font-bold tracking-[0] leading-[79px] uppercase"
              style={{ 
                color: colors.textSecondary,
                fontFamily: 'Inter',
                fontWeight: 900,
                fontSize: '96px'
              }}
            >
              "Bir karar, her şeyi değiştirir."
            </blockquote>

            <div className="relative w-[524px] h-[201px] text-right flex flex-col justify-center">
              <div 
                className="font-semibold leading-[40px]"
                style={{
                  color: colors.textSecondary,
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: '32px'
                }}
              >
                defnecebiroglu@gmail.com<br/>
                iremcebiroglu@gmail.com<br/>
                eylllllltasirtaon@gmail.com
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <footer className="absolute bottom-[151px] left-[329px] right-[155px] flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-[60px] h-[60px] relative flex items-center justify-center">
              <div className="w-[44px] h-[44px] bg-[#E3DFD6] rounded"></div>
            </div>
            <span 
              className="ml-[10px] font-semibold tracking-[0] leading-10 whitespace-nowrap"
              style={{ 
                color: colors.textPrimary,
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '32px'
              }}
            >
              @kalgirisimcilik_
            </span>
          </div>
          
          <div className="flex items-center">
            <div className="w-[60px] h-[60px] relative flex items-center justify-center">
              <div className="w-[48px] h-[48px] bg-[#E3DFD6] rounded"></div>
            </div>
            <span 
              className="ml-[10px] font-semibold tracking-[0] leading-10 whitespace-nowrap"
              style={{ 
                color: colors.textPrimary,
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '32px'
              }}
            >
              @kalgirisimcilik
            </span>
          </div>
        </footer>

        {/* Hidden admin access */}
        <Link href="/admin-login">
          <button className="fixed bottom-4 right-4 opacity-20 hover:opacity-60 bg-gray-800 px-3 py-1 rounded text-xs transition-opacity">
            Admin
          </button>
        </Link>
      </div>
    </main>
  );
}