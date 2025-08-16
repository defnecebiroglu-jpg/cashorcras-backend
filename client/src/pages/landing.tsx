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
    <main className="w-full min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="container-responsive min-h-screen relative" style={{ backgroundColor: colors.background }}>
        
        {/* Header */}
        <header className="flex w-full items-center justify-between p-4 md:p-8 relative">
          <h1 
            className="font-bowlby text-responsive-md text-white"
            style={{ color: colors.textPrimary }}
          >
            KALGIRISIMCILIK
          </h1>

          <nav className="flex items-center gap-4 md:gap-10">
            <div 
              className="font-bowlby text-sm md:text-xl lg:text-2xl hidden sm:block"
              style={{ color: colors.textSecondary }}
            >
              HAKKINDA
            </div>

            <Link href="/team-login">
              <button 
                className="h-10 md:h-[50px] px-4 md:px-6 rounded-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: colors.button }}
              >
                <span 
                  className="font-bowlby text-sm md:text-xl lg:text-2xl text-center"
                  style={{ color: colors.textSecondary }}
                >
                  GİRİŞ YAP
                </span>
              </button>
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="mt-8 md:mt-16 px-4 text-center">
          <h2 
            className="font-bowlby text-responsive-xl leading-tight"
            style={{ color: colors.textPrimary }}
          >
            GİRİŞİMCİLİK<br />SİMÜLASYONU
          </h2>
        </div>

        {/* Main Image/Content Section */}
        <section className="mt-8 md:mt-16 px-4 relative">
          {/* Decorative vector graphics - hidden on mobile */}
          <img
            className="hidden lg:block absolute w-[200px] h-[180px] left-0 top-1/2 transform -translate-y-1/2"
            alt="Vector graphic"
            src="/figmaAssets/vector-4.svg"
          />
          <img
            className="hidden lg:block absolute w-[200px] h-[180px] right-0 top-1/2 transform -translate-y-1/2"
            alt="Vector graphic"
            src="/figmaAssets/vector-5.svg"
          />
          
          {/* Main Cash Crash image */}
          <img
            className="absolute w-[1306px] h-[776px] top-0 left-0 object-cover"
            alt="Cash Crash graphic"
            src="/figmaAssets/image-1.png"
          />
        </section>

        

        {/* Quote Section */}
        <div 
          className="w-[1364px] absolute top-[1109px] left-[38px] rounded-[25px] border-none"
          style={{ backgroundColor: colors.accent }}
        >
          <div className="flex items-start justify-between p-20">
            <blockquote 
              className="relative w-[650px] h-[201px] mt-[-1.00px] tracking-[0] leading-[70px]"
              style={{ 
                color: colors.textSecondary,
                fontFamily: 'Bowlby One',
                fontWeight: 'normal',
                fontSize: '80px',
                lineHeight: '70px'
              }}
            >
              "HER KARAR BİR ÖĞRENME FIRSATIDIR."
            </blockquote>

            <div className="relative w-[423px] h-[111px] mt-4">
              <div 
                className="relative w-[423px] h-[111px] bg-white rounded-lg flex items-center justify-center text-black font-medium text-sm"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              >
                <div className="text-center px-4">
                  <div>kalcc.borsa@gmail.com</div>
                  <div>kalcc.doviz@gmail.com</div>
                  <div>kalcc.girisimcilik@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <footer className="absolute bottom-[151px] left-[329px] right-[155px] flex items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[60px] relative flex items-center justify-center">
              <img
                src="/figmaAssets/vector.svg"
                alt="Social media icon for @kalgirisimcilik_"
                className="relative w-11 h-11 top-2 left-2"
              />
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
          
          <div className="w-[50px]"></div>
          
          <div className="flex items-center">
            <div className="w-[60px] h-[60px] relative flex items-center justify-center">
              <img
                src="/figmaAssets/vector-1.svg"
                alt="Social media icon for @kalgirisimcilik"
                className="relative w-12 h-12 top-1.5 left-1.5"
              />
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