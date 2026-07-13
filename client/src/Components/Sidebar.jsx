import React from 'react';

export default function Sidebar({ userRole, activeTab, setActiveTab, onLogout }) {
  return (
    <div className="w-64 bg-zinc-950 h-full p-6 flex flex-col justify-between border-r border-zinc-850">
      <div className="space-y-8">
        {/* App Title */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎵</span>
          <h1 className="text-xl font-bold tracking-wider text-white">MusicSync</h1>
        </div>

        {/* Navigation Menu Links */}
        <nav className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold px-2 mb-3">Menu</p>
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full text-left p-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'home' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            🏠 Home Overview
          </button>

          {userRole === 'artist' ? (
            <>
              <button 
                onClick={() => setActiveTab('upload')}
                className={`w-full text-left p-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'upload' ? 'bg-purple-950/40 text-purple-400 border border-purple-900/30' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                ➕ Upload Studio
              </button>
              <button 
                onClick={() => setActiveTab('catalog')}
                className={`w-full text-left p-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'catalog' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                💿 My Releases
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setActiveTab('connect')}
                className={`w-full text-left p-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'connect' ? 'bg-green-950/40 text-green-400 border border-green-900/30' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                🔌 Link Platforms
              </button>
              <button 
                onClick={() => setActiveTab('playlists')}
                className={`w-full text-left p-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'playlists' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                🎧 Mixed Playlists
              </button>
            </>
          )}
        </nav>
      </div>

      {/* User Status Profile Footer */}
      <div className="border-t border-zinc-850 pt-4 flex flex-col gap-2">
        <div>
          <span className="text-xs text-zinc-500 font-medium block mb-1">Logged in as:</span>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-zinc-900 border border-zinc-800 inline-block capitalize text-zinc-300">
            {userRole}
          </span>
        </div>
        <button 
          onClick={onLogout}
          className="text-left text-xs text-red-400 hover:text-red-300 transition-colors mt-1 px-1"
        >
          🚪 Sign Out Session
        </button>
      </div>
    </div>
  );
}