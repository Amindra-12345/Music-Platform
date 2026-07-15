import React from 'react';

export default function ListenerView({ activeTab, tracks, currentTrack, isPlaying, onPlayTrack }) {
  // Guard clause for handling specific page views
  if (activeTab !== 'home') {
    return (
      <div className="text-zinc-500 text-xs p-6 italic">
        Library views coming soon...
      </div>
    );
  }

  // Handle absolute loading/empty state gracefully
  if (!tracks || tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border border-zinc-900/60 rounded-xl bg-zinc-950/40">
        <span className="text-2xl animate-pulse">🎵</span>
        <p className="text-zinc-400 text-xs mt-2 font-medium">Connecting to music networks...</p>
      </div>
    );
  }

  // Segment the incoming tracks pool for layout carousels
  const newReleases = tracks.slice(0, 4);
  const hotSongs = tracks.slice(4, 8);
  const hotArtists = tracks.slice(8, 12);

  // Standard Standard Card Element
  const TrackCard = ({ track, isCircle = false }) => {
    const isCurrent = currentTrack?._id === track._id;

    return (
      <div 
        onClick={() => onPlayTrack(track)}
        className="group flex flex-col w-[160px] flex-shrink-0 cursor-pointer select-none"
      >
        {/* Cover Container Frame */}
        <div className={`w-[160px] h-[160px] bg-zinc-900 overflow-hidden relative shadow-lg transition-all duration-300 border border-zinc-900 group-hover:border-zinc-700/50 ${
          isCircle ? 'rounded-full' : 'rounded-xl'
        }`}>
          <img 
            src={track.imageUrl} 
            alt={track.title} 
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105" 
          />
          {/* Action Overlay Trigger */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all font-bold text-lg">
              {isCurrent && isPlaying ? '⏸️' : '▶️'}
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className={`mt-3 w-full ${isCircle ? 'text-center' : 'text-left'}`}>
          <h4 className={`text-xs font-bold truncate px-1 ${isCurrent ? 'text-purple-400' : 'text-zinc-100'}`}>
            {track.title}
          </h4>
          <p className="text-[10px] text-zinc-500 truncate mt-0.5 uppercase tracking-wider px-1 font-medium">
            {track.genre}
          </p>
        </div>
      </div>
    );
  };

  // Reusable Shelf row structure matching premium setups
  const ShelfRow = ({ title, tracksPool, isCircle = false }) => (
    <div className="mb-10 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-black tracking-tight text-white">{title}</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 text-zinc-400 text-xs font-bold">
            <button className="hover:text-white transition px-1">‹</button>
            <button className="hover:text-white transition px-1">›</button>
          </div>
          <button className="text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-wider">See All</button>
        </div>
      </div>
      
      {/* Horizontal Flex Carousel Scroller Viewport */}
      <div className="flex gap-5 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x">
        {tracksPool.map((track) => (
          <TrackCard key={track._id} track={track} isCircle={isCircle} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <ShelfRow title="New Release Playlists" tracksPool={newReleases} />
      <ShelfRow title="Hot Songs" tracksPool={hotSongs} />
      <ShelfRow title="Hot Artists" tracksPool={hotArtists} isCircle={true} />
    </div>
  );
}