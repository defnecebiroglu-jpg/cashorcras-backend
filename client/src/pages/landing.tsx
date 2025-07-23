import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Yellow accent lines - top left */}
        <div className="absolute top-20 left-10 w-20 h-1 bg-yellow-400 rotate-12"></div>
        <div className="absolute top-24 left-8 w-16 h-1 bg-yellow-400 rotate-12"></div>
        <div className="absolute top-28 left-12 w-12 h-1 bg-yellow-400 rotate-12"></div>
        
        {/* Purple accent lines - bottom right */}
        <div className="absolute bottom-32 right-10 w-20 h-1 bg-purple-400 -rotate-12"></div>
        <div className="absolute bottom-28 right-8 w-16 h-1 bg-purple-400 -rotate-12"></div>
        <div className="absolute bottom-24 right-12 w-12 h-1 bg-purple-400 -rotate-12"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="text-xl font-bold tracking-wider">
          KALGIRIŞIMCILIK
        </div>
        <div className="flex space-x-4">
          <Link href="/admin-login">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full font-semibold transition-colors text-sm">
              Admin
            </button>
          </Link>
          <Link href="/team-login">
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-semibold transition-colors">
              GİRİŞ YAP
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        {/* Main heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            KAZANMAYA<br />
            CESARETIN VAR MI?
          </h1>
        </div>

        {/* Logo/Brand section */}
        <div className="relative mb-12">
          <div className="bg-yellow-400 px-8 py-6 rounded-lg transform -rotate-2 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl md:text-8xl font-black text-black mb-2 tracking-wider">
                CASH
              </div>
              <div className="text-4xl md:text-6xl font-black text-black tracking-wider relative">
                CRASH!
                {/* Star decoration */}
                <div className="absolute -top-2 -right-4 text-yellow-600 text-3xl">★</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote section */}
        <div className="bg-yellow-400 text-black px-8 py-6 rounded-lg max-w-2xl w-full text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            "BİR KARAR,<br />
            HER ŞEYİ<br />
            DEĞİŞTİRİR."
          </h2>
          <div className="text-sm md:text-base space-y-1">
            <div>defnecebiroglu@gmail.com</div>
            <div>iremcebiroglu@gmail.com</div>
            <div>eylillilitasitaon@gmail.com</div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Link href="/team-login">
            <button className="bg-purple-600 hover:bg-purple-700 px-12 py-4 rounded-full text-xl font-bold transition-colors shadow-xl">
              OYUNA BAŞLA
            </button>
          </Link>
        </div>
      </main>

      {/* Footer social links */}
      <footer className="relative z-10 flex justify-center items-center space-x-8 pb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold text-sm">♪</span>
          </div>
          <span className="text-sm">@kalgirisimcilik_</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-black font-bold text-sm">@</span>
          </div>
          <span className="text-sm">@kalgirisimcilik</span>
        </div>
      </footer>
    </div>
  );
}