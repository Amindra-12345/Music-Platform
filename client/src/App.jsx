import React, { useState, useEffect } from 'react';
import { fetchTracks } from './services/api';

import Sidebar from './components/Sidebar';
import ArtistView from './components/ArtistView';
import ListenerView from './components/ListenerView';
import Register from './pages/Register';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  
  // Auth Controls
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [initialRole, setInitialRole] = useState('listener');
  
  // Global States
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Catalog States
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());

  useEffect(() => {
    if (token) {
      setUser({
        email: localStorage.getItem('userEmail') || 'User',
        role: localStorage.getItem('userRole') || 'listener'
      });
    }
    loadTracks();
  }, [token]);

  const loadTracks = async () => {
    try {
      const res = await fetchTracks();
      setTracks(res.data);
    } catch (err) {
      console.error("Error loading music catalog:", err);
    }
  };

  const handlePlayTrack = (track) => {
    if (!token) {
      setIsLoginView(false);
      setShowAuthModal(true);
      return;
    }

    if (currentTrack?._id === track._id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      const mediaPath = track.filePath || track.audioUrl;
      audio.src = `http://localhost:5000/${mediaPath}`.replace(/\/+/g, '/').replace('http:/', 'http://');
      audio.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const triggerAuthFlow = (loginMode, role = 'listener') => {
    setIsLoginView(loginMode);
    setInitialRole(role);
    setShowAuthModal(true);
  };

  // Live client-side searching filter
  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden select-none">
      
      {/* --- BRAND NEW TOP HEADER ROW --- */}
      <header className="h-16 px-6 flex justify-between items-center bg-zinc-950 border-b border-zinc-900 sticky top-0 z-30">
        
        {/* Left: Identity Branding */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <span className="text-xl text-purple-500">✨</span>
          <h1 className="text-base font-black tracking-tighter text-white">
            SoundSoul
          </h1>
        </div>

        {/* Center: Interactive Search Bar Engine */}
        <div className="w-full max-w-md mx-4 relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm group-focus-within:text-purple-400 transition-colors">
            🔍
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to play?"
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-full py-2 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/70 focus:bg-zinc-850 transition-all"
          />
        </div>

        {/* Right: Authentication Control Ports */}
        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <button 
                onClick={() => triggerAuthFlow(true)} 
                className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-2 transition-colors duration-150"
              >
                Sign In
              </button>
              <button 
                onClick={() => triggerAuthFlow(false, 'listener')} 
                className="text-xs font-bold bg-zinc-900 text-white border border-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-800 transition-all duration-150"
              >
                Sign up as Listener
              </button>
              <button 
                onClick={() => triggerAuthFlow(false, 'artist')} 
                className="text-xs font-bold bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-all duration-150"
              >
                Sign up as Artist
              </button>
            </>
          ) : (
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="text-xs bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-bold py-2 px-4 rounded-full border border-zinc-800 transition-all"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* --- MAIN PAGE CONTENT ARCHITECTURE --- */}
      <div className="flex flex-1 min-h-0 p-2 gap-2">
        
        {/* Upgraded Left Sidebar */}
        <Sidebar 
          userRole={user?.role || 'guest'} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />

        {/* Workspace Stream Viewport */}
        <div className="flex-1 bg-gradient-to-b from-zinc-900/60 to-black rounded-xl overflow-y-auto flex flex-col border border-zinc-900/40 relative">
          <main className="p-6 flex-1">
            {user?.role === 'artist' ? (
              <ArtistView 
                activeTab={activeTab}
                tracks={filteredTracks} 
                currentTrack={currentTrack} 
                isPlaying={isPlaying} 
                onPlayTrack={handlePlayTrack} 
                refreshTracks={loadTracks} 
              />
            ) : (
              <ListenerView 
                activeTab={activeTab}
                tracks={filteredTracks} 
                currentTrack={currentTrack} 
                isPlaying={isPlaying} 
                onPlayTrack={handlePlayTrack} 
              />
            )}
          </main>
        </div>
      </div>

      {/* FLOATING AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>
            <Register 
              setToken={(t) => { setToken(t); window.location.reload(); }} 
              isLoginView={isLoginView} 
              setIsLoginView={setIsLoginView}
              defaultRole={initialRole}
            />
          </div>
        </div>
      )}

      {/* PLAYER CONTAINER FOOTER */}
      <footer className="h-20 bg-zinc-950 border-t border-zinc-900 px-6 flex items-center justify-between z-10">
        <div className="w-1/4 truncate">
          {currentTrack && <span className="text-xs font-semibold text-white">🔊 {currentTrack.title}</span>}
        </div>
        <button 
          onClick={() => handlePlayTrack(currentTrack || tracks[0])}
          className="p-3 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <div className="w-1/4"></div>
      </footer>

    </div>
  );
}