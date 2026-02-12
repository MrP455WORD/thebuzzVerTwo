import React from 'react';
import { Home, Search, Tv } from 'lucide-react';

interface DockProps {
  onHome: () => void;
  onSearchFocus: () => void;
}

const Dock: React.FC<DockProps> = ({ onHome, onSearchFocus }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-6 md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:translate-x-0 z-50">
      <div className="flex md:flex-col gap-4 p-3 rounded-[32px] bg-glass-100 backdrop-blur-2xl border border-glass-border shadow-2xl transition-transform hover:scale-105">
        
        <button 
          onClick={onHome}
          className="group relative w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-glass-200 transition-all duration-300"
          title="Home"
        >
          <Home size={22} />
          <span className="absolute left-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block backdrop-blur-md">
            خانه
          </span>
        </button>

        <button 
          onClick={onSearchFocus}
          className="group relative w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-glass-200 transition-all duration-300"
          title="Search"
        >
          <Search size={22} />
          <span className="absolute left-14 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block backdrop-blur-md">
            جستجو
          </span>
        </button>
        
         <div className="w-8 h-[1px] bg-glass-border self-center hidden md:block"></div>

         <div className="w-12 h-12 rounded-full flex items-center justify-center text-blue-500 opacity-80">
            <Tv size={20} />
         </div>

      </div>
    </div>
  );
};

export default Dock;