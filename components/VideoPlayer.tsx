import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import { X, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onClose }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isUsingNative, setIsUsingNative] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Clean URL
  const cleanSrc = src.replace('vlc://', 'https://');
  // 2. Proxy URL (Good for MSE/Video.js)
  const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(cleanSrc)}`;
  
  // Decide which URL to use for which player
  // VideoJS likes the proxy. Native tag usually prefers the direct link (if CORS allows) or proxy.
  // We'll try proxy first for consistency.

  useEffect(() => {
    // If we already switched to native, don't re-init video.js
    if (isUsingNative) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);

    if (!playerRef.current && videoRef.current) {
        const videoElement = document.createElement("video-js");
        videoElement.classList.add('vjs-big-play-centered', 'w-full', 'h-full');
        (videoElement as any).crossOrigin = "anonymous";
        (videoElement as any).playsInline = true;
        
        videoRef.current.appendChild(videoElement);

        const player = videojs(videoElement, {
            autoplay: true,
            controls: true,
            responsive: true,
            fluid: true,
            html5: {
                vhs: { 
                    overrideNative: true,
                    // Enable experimental features for better stream handling
                    experimentalESModule: true 
                },
                nativeAudioTracks: false,
                nativeVideoTracks: false
            },
            sources: [
                { src: proxyUrl, type: 'video/mp4' }
            ]
        });

        // Event: Loading State
        player.on('waiting', () => setIsLoading(true));
        player.on('playing', () => setIsLoading(false));
        player.on('canplay', () => setIsLoading(false));

        // Event: ERROR - The Critical Switch
        player.on('error', () => {
            console.log("VideoJS failed, silently switching to Native Player for MKV/Codec support.");
            player.dispose();
            playerRef.current = null;
            setIsUsingNative(true); // Switch UI to native tag
        });

        playerRef.current = player;
    }

    return () => {
        if (playerRef.current && !playerRef.current.isDisposed()) {
            playerRef.current.dispose();
            playerRef.current = null;
        }
    };
  }, [src, isUsingNative]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[60vh] bg-blue-900/30 blur-[150px] rounded-full animate-pulse-glow"></div>
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-8 left-8 z-[120] w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-2xl rounded-full flex items-center justify-center text-white transition-all border border-white/10 hover:rotate-90 duration-300 shadow-2xl group"
        >
            <X size={28} className="drop-shadow-lg" />
        </button>

        {/* Player Container */}
        <div className="relative z-10 w-full max-w-[90%] max-h-[90vh] aspect-video rounded-[32px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] border border-white/10 bg-black/50 backdrop-blur-sm">
            
            {/* 1. Advanced VideoJS Player */}
            {!isUsingNative && (
                <div ref={videoRef} className="w-full h-full" />
            )}

            {/* 2. Fallback Native Player (The "Pre-requisite" solution) */}
            {/* Using native <video> tag handles MKV/HEVC on iOS/Android/Mac natively where JS fails */}
            {isUsingNative && (
                <video 
                    className="w-full h-full object-contain focus:outline-none"
                    controls 
                    autoPlay 
                    playsInline
                    src={proxyUrl} // Try proxy first
                    onError={(e) => {
                        // If proxy fails in native tag (rare), try direct link as last resort
                        const target = e.target as HTMLVideoElement;
                        if (target.src === proxyUrl) {
                            console.log("Proxy failed in native, trying direct...");
                            target.src = cleanSrc; 
                        }
                    }}
                >
                    <source src={proxyUrl} type="video/mp4" />
                    <source src={cleanSrc} type="video/mp4" />
                    <p>Browser not compatible.</p>
                </video>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md transition-opacity">
                    <Loader2 size={60} className="text-white animate-spin drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
                    <span className="mt-4 text-white/70 text-sm font-light tracking-[0.2em] animate-pulse">LOADING</span>
                </div>
            )}
        </div>
    </div>
  );
};

export default VideoPlayer;