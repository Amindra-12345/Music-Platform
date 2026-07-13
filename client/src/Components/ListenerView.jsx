import React from 'react';

export default function ListenerView({ activeTab, tracks, currentTrack, isPlaying, onPlayTrack }) {
  if (activeTab === 'playlists') {
    return (
      <div className="space-y-4 animate-fadeIn">
        <h2 className="text-xl font-bold text-white">My Library</h2>
        <p className="text-zinc-400 text-sm">Your personally curated collections and favorite tracks.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div className="p-5 bg-zinc-900 border border-zinc-850 rounded-xl hover:border-zinc-700 cursor-pointer transition-all">
            <span className="text-3xl">❤️</span>
            <h4 className="font-semibold text-white mt-3">Liked Songs</h4>
            <p className="text-xs text-zinc-500">0 tracks saved</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white">Explore Fresh Music</h2>
        <p className="text-zinc-400 text-sm">Listen to the latest tracks published directly by community artists.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs border-b border-zinc-850">
            <tr>
              <th className="px-6 py-3.5">#</th>
              <th className="px-6 py-3.5">Title</th>
              <th className="px-6 py-3.5">Genre</th>
              <th className="px-6 py-3.5 text-right">Streaming Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {tracks.map((song, index) => {
              const isCurrent = currentTrack?._id === song._id;
              return (
                <tr 
                  key={song._id || song.id} 
                  onClick={() => onPlayTrack(song)}
                  className="hover:bg-zinc-850/40 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-zinc-500 group-hover:text-green-400 font-medium">
                    {isCurrent && isPlaying ? '🔊' : index + 1}
                  </td>
                  <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                    <span className="text-lg">🎵</span> {song.title}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    <span className="px-2 py-0.5 text-xs rounded bg-zinc-800 text-zinc-300 border border-zinc-700">{song.genre}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-400 font-medium group-hover:text-white transition-colors">
                    {isCurrent && isPlaying ? 'Pause Track' : 'Stream Now'}
                  </td>
                </tr>
              );
            })}
            {tracks.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-zinc-500 text-xs">No media uploads available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}