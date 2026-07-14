import React, { useState, useEffect } from 'react';
import { fetchTracks } from './services/api';

import Sidebar from './components/Sidebar';
import ArtistView from './components/ArtistView';
import ListenerView from './components/ListenerView';
import Register from './pages/Register';

export default function App() {
  // --- Route & View Management States ---
  // Track isolated full-screen pages: 'dashboard', 'login', or 'register'
  const [currentView, setCurrentView] = useState('dashboard'); 
  
  // Track workspace views inside the main dashboard panel
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Session & Music Data States ---
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const [initialRegisterRole, setInitialRegisterRole] = useState('listener');

  // Initialize profile context and fetch unified catalog on mount
  useEffect(() => {
    if (token) {
      setUser({
        email: localStorage.getItem('userEmail') || 'User',
        role: localStorage.getItem('userRole') || 'listener'
      });
    }
    loadTracks();
  }, [token]);

  // Unified Hybrid API Data Fetching Engine
  const loadTracks = async () => {
    try {
      // 1. Fetch community uploads from your local Express database setup
      let communityTracks = [];
      try {
        const res = await fetchTracks();
        communityTracks = res.data.map(track => ({
          ...track,
          imageUrl: track.thumbnailPath 
            ? `http://localhost:5000/${track.thumbnailPath}` 
            : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300",
          audioUrl: `http://localhost:5000/${track.filePath}`,
          isInternational: false
        }));
      } catch (dbErr) {
        console.warn("Local backend offline or resting. Loading global charts only.");
      }

      // 2. Query the live external Shazam Core RapidAPI endpoints
      const apiOptions = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY, 
          'X-RapidAPI-Host': 'shazam-core.p.rapidapi.com'
        }
      };

      const globalResponse = await fetch(
        'https://shazam-core.p.rapidapi.com/v1/search/multi?search_type=SONGS&offset=0&query=top', 
        apiOptions
      );
      const globalData = await globalResponse.json();

      // 3. Map complex external nested API items into our flat UI schema components
      const internationalTracks = (globalData.tracks || []).map(track => ({
        _id: track.key,
        title: track.title,
        genre: track.subtitle || "Global Hit",
        imageUrl: track.images?.coverart || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300",
        // Safely extract the preview audio URI string from inside the hub actions block
        audioUrl: track.hub?.actions?.find(a => a.type === 'uri')?.uri, 
        isInternational: true
      }));

      // 4. Merge both arrays into our clean runtime state engine
      setTracks([...communityTracks, ...internationalTracks]);

    } catch (err) {
      console.error("Critical error building unified music collections:", err);
    }
  };

  const handlePlayTrack = (track) => {
    // Intercept guest streams: Force full page authentication routing
    if (!token) {
      setInitialRegisterRole('listener');
      setCurrentView('register');
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
      // Direct asset link conditional resolution
      if (track.isInternational) {
        audio.src = track.audioUrl;
      } else {
        const mediaPath = track.filePath || track.audioUrl;
        audio.src = `http://localhost:5000/${mediaPath}`.replace(/\/+/g, '/').replace('http:/', 'http://');
      }
      
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
    setCurrentView('dashboard');
  };

  // Live filter query matching utility
  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- RENDER VIEW 1: DEDICATED FULL-PAGE SIGN IN VIEW ---
  if (currentView === 'login') {
    return (
      <div className="w-screen h-screen bg-black flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-8 relative">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="absolute top-6 left-6 text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5"
          >
            ← Back to SoundSoul
          </button>
          
          <div className="pt-6">
            <Register 
              setToken={(t) => { setToken(t); setCurrentView('dashboard'); }}
              isLoginView={true}
              setIsLoginView={(val) => setCurrentView(val ? 'login' : 'register')}
              defaultRole="listener"
            />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER VIEW 2: DEDICATED FULL-PAGE REGISTRATION VIEW ---
  if (currentView === 'register') {
    return (
      <div className="w-screen h-screen bg-black flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-8 relative">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="absolute top-6 left-6 text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5"
          >
            ← Back to SoundSoul
          </button>
          
          <div className="pt-6">
            <Register 
              setToken={(t) => { setToken(t); setCurrentView('dashboard'); }}
              isLoginView={false}
              setIsLoginView={(val) => setCurrentView(val ? 'login' : 'register')}
              defaultRole={initialRegisterRole}
            />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER VIEW 3: MAIN DYNAMIC DASHBOARD WORKSPACE LANDING ---
  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden select-none">
      
      {/* GLOBAL TOP NAVBAR SYSTEM */}
      <header className="h-16 px-6 flex justify-between items-center bg-zinc-950 border-b border-zinc-900 sticky top-0 z-30">
        
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <span className="text-xl text-purple-500">✨</span>
          <h1 className="text-base font-black tracking-tighter text-white">
            SoundSoul
          </h1>
        </div>

        {/* Dynamic Catalog Filtration Search Input Bar */}
        <div className="w-full max-w-md mx-4 relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm group-focus-within:text-purple-400 transition-colors">
            🔍
          </span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles or genres..."
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-full py-2 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/70 focus:bg-zinc-850 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <button 
                onClick={() => setCurrentView('login')} 
                className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-2 transition-colors duration-150"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setInitialRegisterRole('listener'); setCurrentView('register'); }} 
                className="text-xs font-bold bg-zinc-900 text-white border border-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-800 transition-all duration-150"
              >
                Sign up as Listener
              </button>
              <button 
                onClick={() => { setInitialRegisterRole('artist'); setCurrentView('register'); }} 
                className="text-xs font-bold bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-500 transition-all duration-150"
              >
                Sign up as Artist
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-400 font-medium hidden md:inline">
                Studio Node: <strong className="text-white">{user?.email}</strong>
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-bold py-2 px-4 rounded-full border border-zinc-800 transition-all"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* LOWER PANEL PANES MAP */}
      <div className="flex flex-1 min-h-0 p-2 gap-2">
        
        <Sidebar 
          userRole={user?.role || 'guest'} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />

        <div className="flex-1 bg-gradient-to-b from-zinc-900/60 to-black rounded-xl overflow-y-auto flex flex-col border border-zinc-900/40 relative">
          <main className="p-6 flex-1">
            {activeTab === 'home' && (
              <div className="p-6 mb-6 rounded-xl bg-gradient-to-r from-purple-950/20 via-zinc-900/50 to-transparent border border-purple-500/10">
                <h2 className="text-2xl font-black text-white">Uncover Fresh Waves</h2>
                <p className="text-zinc-400 text-xs mt-1">
                  Streaming live global hits directly from official metadata networks, synced with community creators.
                </p>
              </div>
            )}

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

      {/* PERSISTENT FOOTER MEDIA PLAYBACK INTERFACE CONTROLS */}
      <footer className="h-20 bg-zinc-950 border-t border-zinc-900 px-6 flex items-center justify-between z-10">
        <div className="w-1/4 flex items-center gap-3">
          {currentTrack ? (
            <>
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-md flex items-center justify-center text-sm overflow-hidden">
                {currentTrack.imageUrl ? (
                  <img src={currentTrack.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  '🎵'
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{currentTrack.title}</h4>
                <p className="text-[10px] text-zinc-500 truncate uppercase tracking-wider">{currentTrack.genre}</p>
              </div>
            </>
          ) : (
            <span className="text-[11px] text-zinc-600 italic">No audio track active</span>
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center w-2/4">
          <button 
            onClick={() => handlePlayTrack(currentTrack || tracks[0])}
            className="w-10 h-10 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow font-bold text-sm"
            disabled={tracks.length === 0}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
        
        <div className="w-1/4"></div>
      </footer>

    </div>
  );
}