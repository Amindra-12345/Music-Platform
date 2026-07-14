import React from 'react';

export default function Sidebar({ userRole, activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-zinc-950 h-full p-4 flex flex-col justify-between border border-zinc-900 rounded-xl space-y-6">
      <div className="space-y-6">
        
        {/* Navigation Core Panel */}
        <div className="bg-zinc-900/40 border border-zinc-900/50 rounded-lg p-2 space-y-1">
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full text-left py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center gap-3 ${
              activeTab === 'home' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🏠</span> Home
          </button>
          
          <button 
            onClick={() => setActiveTab('trending')}
            className={`w-full text-left py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center gap-3 ${
              activeTab === 'trending' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🔥</span> Trending
          </button>
        </div>

        {/* Library & Custom Playlist Panel */}
        <div className="flex-1 bg-zinc-900/40 border border-zinc-900/50 rounded-lg p-3 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
              <span>📚</span> Your Library
            </span>
            <button 
              onClick={() => setActiveTab('playlists')}
              className="text-zinc-500 hover:text-white text-sm font-bold bg-transparent border-0 transition-colors"
              title="Create Playlist"
            >
              ➕
            </button>
          </div>

          <div className="space-y-2">
            {/* Playlist Static Prompt Block */}
            <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-lg space-y-2">
              <h4 className="text-[11px] font-bold text-white">Create your first playlist</h4>
              <p className="text-[10px] text-zinc-500">It's easy, we'll help you organize.</p>
              <button 
                onClick={() => setActiveTab('playlists')}
                className="px-3 py-1 bg-white text-black text-[10px] font-black rounded-full hover:scale-105 transition-transform"
              >
                Create Playlist
              </button>
            </div>
            
            {/* Conditional Node display for Artists */}
            {userRole === 'artist' && (
              <button 
                onClick={() => setActiveTab('upload')}
                className={`w-full text-left py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center gap-3 ${
                  activeTab === 'upload' ? 'bg-purple-950/40 text-purple-400' : 'text-zinc-400 hover:text-white'
                }`}
              >
                📤 Studio Uploader
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Bottom User Matrix Segment */}
      <div className="p-2 bg-zinc-900/20 border border-zinc-900/40 rounded-lg flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Network Node</span>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-zinc-900 text-purple-400 border border-zinc-800 capitalize">
          {userRole}
        </span>
      </div>

    </div>
  );
}