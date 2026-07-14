import React from 'react';

export default function ListenerView({ activeTab, tracks, currentTrack, isPlaying, onPlayTrack }) {
  
  // --- SUB-VIEW: PLAYLISTS / LIBRARY ROUTE ---
  if (activeTab === 'playlists' || activeTab === 'connect') {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div>
          <h2 className="text-xl font-bold text-white">Mixed Playlists & Library</h2>
          <p className="text-zinc-400 text-xs">Your personally curated music hubs and connected streaming accounts.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="p-5 bg-zinc-900 border border-zinc-850 rounded-xl hover:border-zinc-700 hover:bg-zinc-850/30 cursor-pointer transition-all group">
            <div className="w-12 h-12 bg-zinc-950 rounded-lg flex items-center justify-center text-xl border border-zinc-800 group-hover:border-green-500/50 transition-colors">
              ❤️
            </div>
            <h4 className="font-semibold text-white mt-4">Liked Songs</h4>
            <p className="text-xs text-zinc-500 mt-1">Your favorite bookmarked tracks will accumulate here.</p>
          </div>

          <div className="p-5 bg-zinc-900 border border-zinc-850 rounded-xl border-dashed opacity-60">
            <div className="w-12 h-12 bg-zinc-950 rounded-lg flex items-center justify-center text-xl border border-zinc-800">
              ➕
            </div>
            <h4 className="font-semibold text-zinc-400 mt-4">Create New Playlist</h4>
            <p className="text-xs text-zinc-600 mt-1">Feature coming soon.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- DEFAULT VIEW: EXPLORE MUSIC SYSTEM ---
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white">Explore Fresh Music</h2>
        <p className="text-zinc-400 text-sm">Stream original creations published directly by independent artists across the network.</p>
      </div>

      {/* Main Streaming Dashboard Catalog */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden shadow-md">
        <div className="p-4 bg-zinc-950/40 border-b border-zinc-850 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Trending Tracks</h3>
          <span className="text-xs text-zinc-400 font-medium">{tracks.length} Available</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300 min-w-[500px]">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs border-b border-zinc-850">
              <tr>
                <th className="px-6 py-3.5 w-16 text-center">#</th>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Genre</th>
                <th className="px-6 py-3.5 text-right pr-8">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850/40">
              {tracks.map((song, index) => {
                const isCurrent = currentTrack?._id === song._id;
                return (
                  <tr 
                    key={song._id || song.id} 
                    onClick={() => onPlayTrack(song)}
                    className={`transition-colors cursor-pointer group select-none ${
                      isCurrent ? 'bg-zinc-850/30' : 'hover:bg-zinc-850/20'
                    }`}
                  >
                    {/* Track Play/Pause Icon Index Indicator */}
                    <td className="px-6 py-4 text-center text-zinc-500 font-medium group-hover:text-green-400 transition-colors">
                      {isCurrent && isPlaying ? (
                        <span className="text-green-400 animate-pulse">🔊</span>
                      ) : (
                        index + 1
                      )}
                    </td>

                    {/* Metadata Column */}
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <span className="text-base text-zinc-400 group-hover:text-green-400 transition-colors">🎵</span>
                        <span className={isCurrent ? 'text-green-400' : ''}>{song.title}</span>
                      </div>
                    </td>

                    {/* Genre Tag Badge */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-950 text-zinc-400 border border-zinc-800 capitalize">
                        {song.genre}
                      </span>
                    </td>

                    {/* Action Interface Column */}
                    <td className="px-6 py-4 text-right pr-8 text-xs font-semibold tracking-wider text-zinc-500 group-hover:text-white transition-colors uppercase">
                      {isCurrent && isPlaying ? 'Playing Now' : 'Click to Stream'}
                    </td>
                  </tr>
                );
              })}

              {/* Dynamic Empty State Fallback Handler */}
              {tracks.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-zinc-500 text-xs font-medium">
                    No community tracks are available inside the platform catalog right now. 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}