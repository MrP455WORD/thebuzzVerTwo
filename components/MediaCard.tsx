import React, { useState } from 'react';
import { MovieItem } from '../types';
import { ImageOff } from 'lucide-react';

interface MediaCardProps {
  item: MovieItem;
  onClick: (item: MovieItem) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      onClick={() => onClick(item)}
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-glass-100 border border-glass-border transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
    >
        {/* Image or Fallback */}
        {!hasError ? (
            <img 
                src={item.poster} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setHasError(true)}
                loading="lazy"
            />
        ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex flex-col items-center justify-center p-4 text-center">
                <ImageOff className="text-white/20 mb-2" size={32} />
                <span className="text-white/40 text-sm font-light">No Poster</span>
                <span className="text-white font-bold text-lg mt-2 line-clamp-3">{item.title}</span>
            </div>
        )}

        {/* Gradient Overlay (only show if image loaded, otherwise fallback handles text) */}
        {!hasError && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-center text-lg leading-tight drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                </h3>
            </div>
        )}
    </div>
  );
};

export default MediaCard;