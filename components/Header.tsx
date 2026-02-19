
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-emerald-900 text-white pt-12 pb-20 px-6 relative overflow-hidden">
      {/* Decorative Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0l20 20-20 20L0 20z" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        <div className="mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800/80 backdrop-blur-xl border border-emerald-700/50 flex items-center justify-center shadow-inner">
             <svg className="w-6 h-6 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
             </svg>
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-1">Ramadan 1447</h1>
        <p className="text-emerald-300/80 text-xl arabic-font tracking-wide">Ramadan 2026</p>
      </div>
      
      {/* Floating subtle gradients */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mt-32 blur-[80px]"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full -mr-24 -mb-24 blur-[60px]"></div>
    </header>
  );
};
