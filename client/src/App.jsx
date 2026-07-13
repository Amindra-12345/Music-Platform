import React, { useState, useEffect } from 'react';
import { fetchTracks } from './services/api';

// Import modular assets
import Sidebar from './components/Sidebar';
import ArtistView from './components/ArtistView';
import ListenerView from './components/ListenerView';
import Register from './pages/Register';

export default function App() {
  // Global Session States
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  
  // Navigation State to tie Sidebar and Main Content together
  const [activeTab, setActiveTab] = useState('home');

  // Audio Playback Engine States
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());

  // Bootstrap Auth Session
  useEffect(() => {
    if (token) {
      setUser({
        email: localStorage.getItem('userEmail') || 'User',
        role: localStorage.getItem('userRole') || 'listener'
      });
      loadTracks();
    }
  }, [token]);

  const loadTracks = async () => {
    try {
      const res = await fetchTracks();
      setTracks(res.data);
    } catch (err) {
      console.error("Error loading music catalog:", err);
    }
  };

  // Shared Audio Controller Logic
  const handlePlayTrack = (track) => {
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

  // --- RENDERING GATEWAY: AUTH GATE ---
  if (!token) {
    return (
      <Register 
        setToken={setToken} 
        isLoginView={isLoginView} 
        setIsLoginView={setIsLoginView} 
      />
    );
  }

  // --- MAIN APP SYSTEM DESKTOP LAYOUT ---
  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden select-none">
      
      {/* Dynamic Working Frame */}
      <div className="flex flex-1 min-h-0 p-2 gap-2">
        
        {/* Modular Sidebar */}
        <Sidebar 
          userRole={user?.role || 'listener'} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onLogout={handleLogout} 
        />

        {/* Core Dashboard Workspace Switching based on User Role */}
        <main className="flex-1 bg-gradient-to-b from-[#222] to-[#121212] rounded-lg overflow-y-auto p-6 scrollbar-thin">
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

      {/* --- FOOTER REGION: SHARED PLAYER BAR CONTROL PANEL --- */}
      <footer className="h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between z-10">
        <div className="w-1/4 flex items-center gap-3">
          {currentTrack ? (
            <>
              <div className="w-14 h-14 bg-[#282828] rounded flex items-center justify-center text-[#1ED760]">
                <span className="text-xl">🎵</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
                <p className="text-xs text-[#b3b3b3] truncate capitalize">{currentTrack.genre}</p>
              </div>
            </>
          ) : (
            <span className="text-xs text-[#b3b3b3]">No active streaming target</span>
          )}
        </div>

        {/* Global Action Play Button */}
        <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
          <button 
            disabled={!currentTrack} 
            onClick={() => currentTrack && handlePlayTrack(currentTrack)}
            className="p-3 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>

        {/* Balance layout column spacer */}
        <div className="w-1/4 flex justify-end">
          {user && (
            <button 
              onClick={handleLogout}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-1.5 px-3 rounded transition-all"
            >
              Sign Out
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}