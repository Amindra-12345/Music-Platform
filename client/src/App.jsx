import React, { useState, useEffect } from 'react';
import { fetchTracks } from './services/api';

import Sidebar from './components/Sidebar';
import ArtistView from './components/ArtistView';
import ListenerView from './components/ListenerView';
import Register from './pages/Register';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [initialRole, setInitialRole] = useState('listener');
  const [activeTab, setActiveTab] = useState('home');

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
      <div className="flex flex-1 min-h-0 p-2 gap-2">
        
        {/* Sidebar Frame - Brand Synced to SoundSoul */}
        <Sidebar 
          userRole={user?.role || 'guest'} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onLogout={handleLogout} 
          triggerAuth={() => triggerAuthFlow(true)}
        />

        {/* Dashboard Workspace */}
        <div className="flex-1 bg-gradient-to-b from-[#1c1917] via-[#0c0a09] to-black rounded-xl overflow-y-auto flex flex-col scrollbar-none relative border border-zinc-800/40">
          
          {/* TOP INTERACTIVE NAVBAR */}
          <header className="p-4 flex justify-between items-center bg-zinc-900/40 backdrop-blur-md sticky top-0 z-20 border-b border-zinc-800/30">
            <div className="text-sm font-medium text-zinc-400">
              {token ? (
                <span className="flex items-center gap-2">✨ Active Studio: <strong className="text-white">{user?.email}</strong></span>
              ) : (
                <span className="text-purple-400 font-semibold animate-pulse">🎵 Welcome to the SoundSoul Network</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {!token ? (
                <>
                  <button 
                    onClick={() => triggerAuthFlow(true)} 
                    className="text-sm font-bold text-zinc-400 hover:text-white px-4 py-2 transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => triggerAuthFlow(false, 'listener')} 
                    className="text-sm font-bold bg-zinc-900 text-white border border-zinc-700 px-4 py-2 rounded-full hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-black/40"
                  >
                    Join as Listener
                  </button>
                  <button 
                    onClick={() => triggerAuthFlow(false, 'artist')} 
                    className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:from-purple-500 hover:to-indigo-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-purple-900/20"
                  >
                    Join as Artist
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleLogout}
                  className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium py-2 px-4 rounded-full border border-zinc-800 transition-all active:scale-95"
                >
                  Sign Out Session
                </button>
              )}
            </div>
          </header>

          {/* MAIN INTERACTIVE APP CONTENT DISPLAY */}
          <main className="p-6 flex-1 space-y-8">
            {/* Dynamic Welcome Showcase Hero Header */}
            {activeTab === 'home' && (
              <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-900/30 via-zinc-900/60 to-transparent border border-purple-500/10 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
                <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  Discover SoundSoul
                </h1>
                <p className="text-zinc-400 text-sm mt-2 max-w-xl leading-relaxed">
                  Stream premium original tracks, link active musical platforms, and coordinate your mixed playlists inside a simplified decentralized layout.
                </p>
              </div>
            )}

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
              <ListenerView 
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

      {/* FLOATING MODAL FORM OVERLAY */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/80">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white text-base transition-colors duration-150"
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

      {/* AUDIO ENGINE CONTROL FOOTER BAR */}
      <footer className="h-20 bg-[#0c0a09] border-t border-zinc-900 px-6 flex items-center justify-between z-10">
        <div className="w-1/4 flex items-center gap-3">
          {currentTrack ? (
            <>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-900 to-zinc-900 rounded-lg flex items-center justify-center text-lg shadow border border-purple-500/20 shadow-purple-500/5">
                🎵
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
                <p className="text-xs text-[#b3b3b3] truncate capitalize tracking-wide">{currentTrack.genre}</p>
              </div>
            </>
          ) : (
            <span className="text-xs text-zinc-500 italic">Select a music record to play</span>
          )}
        </div>
        
        <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
          <button 
            onClick={() => handlePlayTrack(currentTrack || tracks[0])}
            className="p-3 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-md"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
        <div className="w-1/4"></div>
      </footer>
    </div>
  );
}