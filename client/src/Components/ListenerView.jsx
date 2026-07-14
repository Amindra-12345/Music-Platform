import React from 'react';

export default function ListenerView({ activeTab, tracks, currentTrack, isPlaying, onPlayTrack }) {
  
  // Hardcoded mock metadata to match the interface design aesthetics
  const artists = [
    { name: 'Dhyan Hewage', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60' },
    { name: 'DILU Beats', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60' },
    { name: 'Anirudh Ravichander', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60' },
    { name: 'A.R. Rahman', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=60' },
    { name: 'Mihiran', img: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=60' },
    { name: 'Yasas Medagedara', img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=60' }
  ];

  // --- PLAYLISTS ROUTE ---
  if (activeTab === 'playlists' || activeTab === 'connect') {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div>
          <h2 className="text-xl font-bold text-white">Your Playlists</h2>
          <p className="text-zinc-400 text-xs">Manage your custom libraries here.</p>
        </div>
        <div className="p-8 bg-zinc-900/40 border border-zinc-800 rounded-xl max-w-sm text-center">
          <span className="text-3xl">➕</span>
          <h4 className="font-bold mt-2 text-white">Create your first playlist</h4>
          <p className="text-xs text-zinc-500 mt-1">It's easy, we'll help you.</p>
          <button className="mt-4 px-4 py-1.5 text-xs font-bold bg-white text-black rounded-full hover:scale-105 transition-transform">
            Create playlist
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-24 animate-fadeIn">
      
      {/* SECTION 1: TRENDING SONGS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">Trending songs</h2>
          <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Show all</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tracks.slice(0, 6).map((track) => {
            const isCurrent = currentTrack?._id === track._id;
            return (
              <div 
                key={track._id || track.id}
                onClick={() => onPlayTrack(track)}
                className={`p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/40 hover:bg-zinc-800/60 transition-all duration-300 group cursor-pointer relative`}
              >
                {/* Square Album Cover Box */}
                <div className="aspect-square w-full bg-gradient-to-br from-purple-900/40 to-zinc-800 rounded-lg flex items-center justify-center text-3xl shadow-md relative overflow-hidden mb-3">
                  💿
                  {/* Floating Play/Pause Action overlay */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                    <button className="w-10 h-10 rounded-full bg-green-500 text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 text-sm font-bold">
                      {isCurrent && isPlaying ? '⏸️' : '▶️'}
                    </button>
                  </div>
                </div>
                <h3 className={`font-bold text-xs truncate ${isCurrent ? 'text-green-400' : 'text-white'}`}>
                  {track.title}
                </h3>
                <p className="text-[11px] text-zinc-400 truncate mt-1 capitalize">{track.genre}</p>
              </div>
            );
          })}

          {tracks.length === 0 && (
            <div className="col-span-full py-8 text-zinc-500 text-xs italic">
              No music tracks uploaded in the database system yet.
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: POPULAR ARTISTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">Popular artists</h2>
          <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Show all</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map((artist, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-transparent hover:bg-zinc-900/40 transition-all duration-200 group text-center cursor-pointer"
            >
              {/* Circular Avatar Frame */}
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-lg border border-zinc-800 bg-zinc-900 mb-3 relative">
                <img 
                  src={artist.img} 
                  alt={artist.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-xs text-white truncate px-1">{artist.name}</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Artist</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: ALBUMS AND SINGLES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white hover:underline cursor-pointer">Popular albums and singles</h2>
          <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">Show all</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Sample dynamic wrapper mapping album view */}
          {tracks.slice().reverse().map((track, idx) => (
            <div 
              key={idx}
              onClick={() => onPlayTrack(track)}
              className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/40 hover:bg-zinc-800/60 transition-all duration-200 group cursor-pointer"
            >
              <div className="aspect-square w-full bg-gradient-to-tr from-indigo-950/40 to-zinc-900 rounded-lg flex items-center justify-center text-3xl shadow-md mb-3">
                🎵
              </div>
              <h3 className="font-bold text-xs text-white truncate">{track.title}</h3>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5 capitalize">{track.genre} Remix</p>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}