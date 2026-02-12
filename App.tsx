import React, { useState } from 'react';
import Background from './components/Background';
import Dock from './components/Dock';
import SearchIsland from './components/SearchIsland';
import MediaCard from './components/MediaCard';
import DetailsSheet from './components/DetailsSheet';
import VideoPlayer from './components/VideoPlayer';
import { searchMovies, fetchDetails } from './services/scraperService';
import { MovieItem, SeasonData, ViewMode } from './types';

const App: React.FC = () => {
  // State
  const [isActive, setIsActive] = useState(false); // Is search active/results shown
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MovieItem[]>([]);
  const [focusTrigger, setFocusTrigger] = useState(0);

  const [activeMovie, setActiveMovie] = useState<MovieItem | null>(null);
  const [detailsData, setDetailsData] = useState<SeasonData | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.HOME);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Handlers
  const handleHome = () => {
    setIsActive(false);
    setResults([]);
    setActiveMovie(null);
    setViewMode(ViewMode.HOME);
    setVideoUrl(null);
  };

  const handleSearchFocus = () => {
    setFocusTrigger(prev => prev + 1);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    // Check for direct play links (vlc:// or http)
    if (query.startsWith('vlc://') || query.startsWith('http')) {
        handlePlay(query);
        return;
    }

    setIsActive(true);
    setIsLoading(true);
    setResults([]);

    try {
      const items = await searchMovies(query);
      setResults(items);
    } catch (e) {
      console.error(e);
      // Optional: Toast error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = async (item: MovieItem) => {
    setActiveMovie(item);
    setDetailsData(null);
    setDetailsLoading(true);

    try {
      const data = await fetchDetails(item.link);
      setDetailsData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handlePlay = (url: string) => {
    setVideoUrl(url);
    setViewMode(ViewMode.PLAYER);
  };

  const handleClosePlayer = () => {
    setVideoUrl(null);
    setViewMode(ViewMode.HOME);
  };

  return (
    <>
      <Background />
      
      {/* Main UI Layer */}
      <div className={`relative flex flex-col h-screen transition-opacity duration-500 ${viewMode === ViewMode.PLAYER ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        <Dock onHome={handleHome} onSearchFocus={handleSearchFocus} />
        
        <main className="flex-1 relative w-full max-w-7xl mx-auto">
          <SearchIsland 
            isActive={isActive} 
            isLoading={isLoading} 
            onSearch={handleSearch} 
            onBack={handleHome}
            focusTrigger={focusTrigger}
          />

          {/* Results Grid */}
          <div 
            className={`
              absolute inset-0 top-32 overflow-y-auto p-6 md:p-10 no-scrollbar transition-all duration-700 delay-200
              ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}
            `}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-32">
              {results.map(item => (
                <MediaCard key={item.id} item={item} onClick={handleCardClick} />
              ))}
            </div>
            
            {!isLoading && results.length === 0 && isActive && (
               <div className="text-center text-gray-500 mt-20">No results found.</div>
            )}
          </div>
        </main>
      </div>

      {/* Details Sheet */}
      <DetailsSheet 
        isOpen={!!activeMovie && viewMode !== ViewMode.PLAYER}
        title={activeMovie?.title || ''}
        data={detailsData}
        isLoading={detailsLoading}
        onClose={() => setActiveMovie(null)}
        onPlay={handlePlay}
      />

      {/* Video Player Overlay */}
      {viewMode === ViewMode.PLAYER && videoUrl && (
        <div className="fixed inset-0 z-[100] bg-black animate-fade-in">
           <VideoPlayer src={videoUrl} onClose={handleClosePlayer} />
        </div>
      )}
    </>
  );
};

export default App;