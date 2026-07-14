import React from 'react';

export default function ListenerView({ activeTab, tracks, currentTrack, isPlaying, onPlayTrack }) {
  // 1. Separate the API data stream into organized UI rows
  const internationalHits = tracks.filter(track => track.isInternational);
  const communityTracks = tracks.filter(track => !track.isInternational);

  // Group artists uniquely for the circular portrait gallery row
  const uniqueArtists = Array.from(new Set(tracks.map(t => t.genre || "Global Hit"))).map(artistName => {
    const trackMatch = tracks.find(t => (t.genre || "Global Hit") === artistName);
    return {
      name: artistName,
      imageUrl: trackMatch?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
    };
  });

  if (activeTab !== 'home') {
    return <div className="text-zinc-500 text-xs p-6">Library sub-modules loading...</div>;
  }

  return (
    <div className="space-y-10 text-white pb-24">
      
      {/* ─── ROW 1: DYNAMIC PLAYLISTS CAROUSEL (SQUARE CARD ROW) ─── */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight text-white">New Release Playlists</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-zinc-400 text-sm">
              <button className="hover:text-white transition p-1">‹</button>
              <button className="hover:text-white transition p-1">›</button>
            </div>
            <button className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider">See All</button>
          </div>
        </div>
        
        {/* Horizontal Container Slider */}
        <div className="flex gap-5 overflow-x-auto scrollbar-none pb-2">
          {internationalHits.map(track => (
            <div 
              key={track._id} 
              onClick={() => onPlayTrack(track)}
              className="w-[170px] flex-shrink-0 cursor-pointer group snap-start"
            >
              <div className="w-[170px] h-[170px] bg-zinc-900 rounded-md overflow-hidden relative shadow-lg">
                <img 
                  src={track.imageUrl} 
                  alt={track.title} 
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105" 
                />
                {/* Floating Play Overlay Hover Indicator */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-105 transition-opacity flex items-center justify-center">
                  <span className="text-2xl">{currentTrack?._id === track._id && isPlaying ? '⏸️' : '▶️'}</span>
                </div>
              </div>
              <h3 className="text-sm font-bold mt-2 truncate text-zinc-100 group-hover:text-purple-400 transition-colors">
                {track.title}
              </h3>
              <p className="text-xs text-zinc-400 truncate mt-0.5">{track.genre}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── ROW 2: HOT SONGS COMPACT MULTI-COLUMN GRID ─── */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight text-white">Hot Songs</h2>
          <button className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider">See All</button>
        </div>

        {/* 3-Column Column Flow List System matching Amazon's compact row format */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
          {tracks.slice(0, 9).map(track => (
            <div 
              key={track._id}
              onClick={() => onPlayTrack(track)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                currentTrack?._id === track._id ? 'bg-zinc-800/80 border border-purple-500/30' : 'bg-zinc-900/40 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 bg-zinc-800 rounded overflow-hidden flex-shrink-0 relative group">
                  <img src={track.imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs">
                    {currentTrack?._id === track._id && isPlaying ? '⏸️' : '▶️'}
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold truncate text-white">{track.title}</h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{track.genre}</p>
                </div>
              </div>
              <span className="text-zinc-500 text-xs pr-2">3:12</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── ROW 3: HOT ARTISTS PERFECT CIRCLES ─── */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold tracking-tight text-white">Hot Artists</h2>
          <button className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider">See All</button>
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-none pb-2">
          {uniqueArtists.map((artist, idx) => (
            <div key={idx} className="w-[140px] flex-shrink-0 flex flex-col items-center group cursor-pointer">
              <div className="w-[130px] h-[130px] rounded-full overflow-hidden border border-zinc-800 shadow-md bg-zinc-900 transition duration-300 group-hover:border-purple-500">
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name} 
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105 grayscale group-hover:grayscale-0" 
                />
              </div>
              <span className="text-xs font-medium mt-3 text-zinc-300 group-hover:text-white transition-colors text-center truncate w-full">
                {artist.name}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}