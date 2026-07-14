import React from 'react';

export default function Sidebar({ userRole, activeTab, setActiveTab, onLogout, triggerAuth }) {
  return (
    <div className="w-64 bg-zinc-950 h-full p-5 flex flex-col justify-between border-r border-zinc-900 rounded-xl">
      <div className="space-y-8">
        
        {/* Brand App Identity */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <span className="text-2xl bg-gradient-to-br from-purple-400 to-indigo-600 bg-clip-text text-transparent">✨</span>
          <h1 className="text-lg font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-purple-400">
            SoundSoul
          </h1>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold px-2 mb-2">Workspace</p>
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'home' ? 'bg-zinc-900 text-white shadow-sm border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
            }`}
          >
            🏠 Discovery Feed
          </button>

          {userRole === 'artist' ? (
            <>
              <button 
                onClick={() => setActiveTab('upload')}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'upload' ? 'bg-purple-950/30 text-purple-400 border border-purple-900/40' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
              >
                ➕ Studio Uploader
              </button>
              <button 
                onClick={() => setActiveTab('catalog')}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'catalog' ? 'bg-zinc-900 text-white shadow-sm border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
              >
                💿 Released Catalog
              </button>
            </>
          ) : userRole === 'listener' ? (
            <>
              <button 
                onClick={() => setActiveTab('connect')}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'connect' ? 'bg-zinc-900 text-white shadow-sm border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
              >
                🔌 Linked Nodes
              </button>
              <button 
                onClick={() => setActiveTab('playlists')}
                className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'playlists' ? 'bg-zinc-900 text-white shadow-sm border border-zinc-800' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                }`}
              >
                🎧 Mixed Playlists
              </button>
            </>
          ) : (
            // Guest View Mode Sidebar Notice
            <div className="mt-4 p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/60 text-center">
              <p className="text-[11px] text-zinc-500 font-medium">Log in to unlock custom playlists & music uploads.</p>
              <button 
                onClick={triggerAuth}
                className="mt-2 text-[11px] font-bold text-purple-400 hover:text-purple-350 underline bg-transparent cursor-pointer"
              >
                Access Account
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Footer Profile Status Block */}
      <div className="border-t border-zinc-900 pt-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Access Profile</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 capitalize text-zinc-400">
            {userRole}
          </span>
        </div>
        {userRole !== 'guest' && (
          <button 
            onClick={onLogout}
            className="w-full text-left text-xs text-red-400/80 hover:text-red-400 transition-colors mt-3 font-semibold px-1"
          >
            🚪 Exit Session
          </button>
        )}
      </div>
    </div>
  );
}