import React, { useEffect, useRef } from 'react';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchIslandProps {
  isActive: boolean;
  isLoading: boolean;
  onSearch: (query: string) => void;
  onBack: () => void;
  focusTrigger: number; // Increment to force focus
}

const SearchIsland: React.FC<SearchIslandProps> = ({ isActive, isLoading, onSearch, onBack, focusTrigger }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusTrigger > 0 && inputRef.current) {
        inputRef.current.focus();
    }
  }, [focusTrigger]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(e.currentTarget.value);
    }
  };

  return (
    <div 
      className={`
        absolute z-40 transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1)
        ${isActive 
          ? 'top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl' 
          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl'
        }
      `}
    >
        {/* Brand Title - Fades out when active */}
        <div 
            className={`
                text-center mb-8 transition-all duration-500 origin-bottom
                ${isActive ? 'opacity-0 scale-75 h-0 mb-0 overflow-hidden' : 'opacity-100 scale-100'}
            `}
        >
            <h1 className="text-5xl md:text-7xl font-thin tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                CINEMA OS
            </h1>
        </div>

        {/* Search Input Container */}
        <div 
            className={`
                relative flex items-center gap-3 p-2 rounded-full border border-glass-border
                backdrop-blur-3xl shadow-2xl transition-all duration-500
                ${isActive ? 'bg-black/60' : 'bg-glass-100 hover:scale-[1.02]'}
            `}
        >
            <Search className="ml-4 text-gray-400" size={24} />
            
            <input
                ref={inputRef}
                type="text"
                placeholder="نام فیلم یا لینک مستقیم..."
                className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-gray-500 font-light h-12"
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />

            {isActive ? (
                <button 
                    onClick={onBack}
                    className="w-12 h-12 rounded-full bg-glass-200 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
            ) : (
                <button 
                    onClick={() => inputRef.current && onSearch(inputRef.current.value)}
                    className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-900/50 transition-all hover:scale-105 active:scale-95"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Search size={20} />
                    )}
                </button>
            )}
        </div>
    </div>
  );
};

export default SearchIsland;