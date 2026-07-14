import React, { useState, useEffect } from 'react';
import { fetchTracks } from './services/api';

import Sidebar from './components/Sidebar';
import ArtistView from './components/ArtistView';
import ListenerView from './components/ListenerView';
import Register from './pages/Register';

export default function App() {
  // Global Session States (Empty string means public guest viewer)
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  
  // Auth Modal/View Controls
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [initialRole, setInitialRole] = useState('listener'); // default pick
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');

  // Audio Playback Engine States
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());

  // Bootstrap Auth Session or Public View on Load
  useEffect(() => {
    if (token) {
      setUser({
        email: localStorage.getItem('userEmail') || 'User',
        role: localStorage.getItem('userRole') || 'listener'
      });
    }
    loadTracks(); // Fetch catalog publicly for Google visitors!
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
    // GUEST GUARD: If a public user tries to listen, redirect to sign up/in
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

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUser(null);
    audio.pause();
    setIsPlaying(false);
    setActiveTab('home');
  };

  const triggerAuthFlow = (loginMode, role = 'listener') => {
    setIsLoginView(loginMode);
    setInitialRole(role);
    setShowAuthModal(true);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden select-none">
      
      {/* Dynamic Main Layout Frame */}
      <div className="flex flex-1 min-h-0 p-2 gap-2">
        
        {/* Sidebar Frame */}
        <Sidebar 
          userRole={user?.role || 'guest'} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onLogout={handleLogout} 
          triggerAuth={() => triggerAuthFlow(true)}
        />

        {/* Core Workspace Frame */}
        <div className="flex-1 bg-gradient-to-b from-[#222] to-[#121212] rounded-lg overflow-y-auto flex flex-col scrollbar-thin">
          
          {/* --- TOP HEADER ROW: SIGN IN / SIGN UP SYSTEM BAR --- */}
          <header className="p-4 flex justify-between items-center bg-zinc-900/40 rounded-t-lg backdrop-blur-md sticky top-0 z-20">
            <div className="text-sm font-semibold text-zinc-400">
              {token ? `Welcome back, ${user?.email}` : "✨ Explore trending tracks publicly"}
            </div>
            
            <div className="flex items-center gap-3">
              {!token ? (
                <>
                  <button 
                    onClick={() => triggerAuthFlow(true)} 
                    className="text-sm font-bold text-zinc-300 hover:text-white px-4 py-2 transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => triggerAuthFlow(false, 'listener')} 
                    className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full hover:scale-105 transition-all"
                  >
                    Join as Listener
                  </button>
                  <button 
                    onClick={() => triggerAuthFlow(false, 'artist')} 
                    className="text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full hover:scale-105 transition-all"
                  >
                    Join as Artist
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="text-xs bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-medium py-1.5 px-4 rounded-full border border-zinc-700 transition-all"
                >
                  Sign Out
                </button>
              )}
            </div>
          </header>

          {/* Main Dashboard Workspace Display */}
          <main className="p-6 flex-1">
            {user?.role === 'artist' ? (
              <ArtistView 
                activeTab={activeTab}
                tracks={tracks} 
                currentTrack={currentTrack} 
                isPlaying={isPlaying} 
                onPlayTrack={handlePlayTrack} 
                refreshTracks={loadTracks} 
              />
            ) : (
              <BrowseLandingView 
                activeTab={activeTab}
                tracks={tracks} 
                currentTrack={currentTrack} 
                isPlaying={isPlaying} 
                onPlayTrack={handlePlayTrack} 
              />
            )}
          </main>
        </div>
      </div>

      {/* --- FLOATING AUTH LAYER INTERFACE (MODAL VIEW) --- */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            <Register 
              setToken={(t) => { setToken(t); setShowAuthModal(false); }} 
              isLoginView={isLoginView} 
              setIsLoginView={setIsLoginView}
              defaultRole={initialRole}
            />
          </div>
        </div>
      )}

      {/* --- FOOTER ENGINE --- */}
      <footer className="h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between z-10">
        <div className="w-1/4 flex items-center gap-3">
          {currentTrack ? (
            <>
              <div className="w-14 h-14 bg-[#282828] rounded flex items-center justify-center text-[#1ED760]">🎵</div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
                <p className="text-xs text-[#b3b3b3] truncate capitalize">{currentTrack.genre}</p>
              </div>
            </>
          ) : (
            <span className="text-xs text-[#b3b3b3]">Select a track to start playing</span>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
          <button 
            onClick={() => handlePlayTrack(currentTrack || tracks[0])}
            className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
        <div className="w-1/4"></div>
      </footer>
    </div>
  );
}

// Simple fallback browse/listener wrapper component for unauthenticated landing routing
function BrowseLandingView(props) {
  return <ListenerView {...props} />;
}