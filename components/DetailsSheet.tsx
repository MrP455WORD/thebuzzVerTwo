import React, { useState, useEffect } from 'react';
import { X, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { SeasonData, Episode } from '../types';

interface DetailsSheetProps {
  isOpen: boolean;
  title: string;
  data: SeasonData | null;
  isLoading: boolean;
  onClose: () => void;
  onPlay: (url: string) => void;
}

const DetailsSheet: React.FC<DetailsSheetProps> = ({ isOpen, title, data, isLoading, onClose, onPlay }) => {
  const [activeSeason, setActiveSeason] = useState<string | null>(null);

  // Reset active season when data changes
  useEffect(() => {
    if (data) {
        const keys = Object.keys(data);
        if (keys.length > 0) setActiveSeason(keys[0]);
    }
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#1a1a1a]/90 backdrop-blur-2xl border border-glass-border rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <h2 className="text-2xl font-bold truncate pr-4">{title}</h2>
            <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40 text-blue-400">
                    <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mb-4" />
                    <span>در حال دریافت اطلاعات...</span>
                </div>
            ) : !data || Object.keys(data).length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    لینک قابل پخشی یافت نشد.
                </div>
            ) : (
                <div className="space-y-4">
                    {(Object.entries(data) as [string, Episode[]][]).map(([seasonName, episodes]) => (
                        <div key={seasonName} className="bg-white/5 rounded-3xl overflow-hidden border border-white/5">
                            <button 
                                onClick={() => setActiveSeason(activeSeason === seasonName ? null : seasonName)}
                                className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                            >
                                <span className="font-semibold text-lg">{seasonName}</span>
                                {activeSeason === seasonName ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            
                            {activeSeason === seasonName && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-5 pt-0 animate-fade-in">
                                    {episodes.map((ep: Episode, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => onPlay(ep.url)}
                                            className="group relative bg-black/40 hover:bg-white text-left p-4 rounded-xl border border-white/10 transition-all hover:scale-105 overflow-hidden"
                                        >
                                            <div className="relative z-10 flex flex-col h-full justify-between group-hover:text-black">
                                                <span className="font-bold text-sm block truncate mb-1">{ep.name}</span>
                                                <span className="text-[10px] opacity-60 uppercase tracking-wider">Play</span>
                                            </div>
                                            
                                            {/* Play Icon Decor */}
                                            <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity text-black">
                                                <Play size={16} fill="currentColor" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DetailsSheet;