import React, { useState, useEffect } from 'react';
import { fetchTracks } from './services/api';

import Sidebar from './components/Sidebar';
import ArtistView from './components/ArtistView';
import ListenerView from './components/ListenerView';
import Register from './pages/Register';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [activeTab, setActiveTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [showSignUpDropdown, setShowSignUpDropdown] = useState(false);

  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const [initialRegisterRole, setInitialRegisterRole] = useState('listener');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (token) {
      setUser({
        email: localStorage.getItem('userEmail') || 'User',
        role: localStorage.getItem('userRole') || 'listener'
      });
    }
    loadTracks();
  }, [token]);

  useEffect(() => {
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      const idx = tracks.findIndex(t => t._id === currentTrack?._id);
      const next = tracks[idx + 1];
      if (next) handlePlayTrack(next);
      else setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audio, tracks, currentTrack]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const loadTracks = async () => {
    try {
      let communityTracks = [];
      try {
        const res = await fetchTracks();
        if (res && res.data) {
          communityTracks = res.data.map(track => ({
            ...track,
            imageUrl: track.thumbnailPath 
              ? `http://localhost:5000/${track.thumbnailPath}` 
              : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300",
            audioUrl: `http://localhost:5000/${(track.audioUrl || '').replace(/\\/g, '/')}`,
            isInternational: false
          }));
        }
      } catch (dbErr) {
        console.warn("Local backend unavailable.", dbErr);
      }

      const mockBackupTracks = [
        { _id: 'mock-1', title: 'Starlight Symphony', genre: 'Synthwave', imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-2', title: 'Midnight Echoes', genre: 'Lo-Fi Chill', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-3', title: 'Neon Horizon', genre: 'Cyberpunk', imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-4', title: 'Golden Hour Beat', genre: 'R&B Soul', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-5', title: 'Velocity Core', genre: 'Techno', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-6', title: 'Ocean Whisper', genre: 'Ambient', imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-7', title: 'Retro Groove', genre: 'Disco Funk', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-8', title: 'Ethereal Space', genre: 'Dream Pop', imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-9', title: 'Solar Flare', genre: 'Progressive House', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-10', title: 'Digital Rain', genre: 'Glitch Hop', imageUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-11', title: 'Anirudh Mix', genre: 'Composer Focus', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300', audioUrl: '', isInternational: true },
        { _id: 'mock-12', title: 'Rahman Vibes', genre: 'Classic Fusion', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300', audioUrl: '', isInternational: true }
      ];

      if (communityTracks.length > 0) {
        setTracks([...communityTracks, ...mockBackupTracks]);
      } else {
        setTracks(mockBackupTracks);
      }

    } catch (err) {
      console.error("Error loading tracks:", err);
    }
  };

  const handlePlayTrack = (track) => {
    if (!token) {
      setInitialRegisterRole('listener');
      setCurrentView('register');
      return;
    }

    if (!track) return;

    if (currentTrack?._id === track._id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      const src = track.audioUrl || '';
      if (!src) {
        console.warn("No audio URL for this track");
        return;
      }
      audio.src = src;
      audio.play()
        .then(() => {
          setCurrentTrack(track);
          setIsPlaying(true);
        })
        .catch(err => console.warn("Playback failed:", err));
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

  const filteredTracks = tracks.filter(track => 
    track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.genre?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden select-none">
      
      <header className="h-16 px-6 flex justify-between items-center bg-zinc-950 border-b border-zinc-900 sticky top-0 z-30">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <span className="text-xl text-purple-500">✨</span>
          <h1 className="text-base font-black tracking-tighter text-white">SoundSoul</h1>
        </div>

        <div className="w-full max-w-md mx-4 relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm group-focus-within:text-purple-400 transition-colors">🔍</span>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles or genres..."
            className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-full py-2 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/70 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 relative">
          {!token ? (
            <>
              <button 
                onClick={() => { setCurrentView('login'); setShowSignUpDropdown(false); }} 
                className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowSignUpDropdown(!showSignUpDropdown)} 
                  className="text-xs font-bold bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-500 transition-all flex items-center gap-1"
                >
                  Sign Up <span className="text-[10px] opacity-80">{showSignUpDropdown ? '▲' : '▼'}</span>
                </button>

                {showSignUpDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSignUpDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50">
                      <button 
                        onClick={() => { setInitialRegisterRole('listener'); setCurrentView('register'); setShowSignUpDropdown(false); }}
                        className="w-full text-left text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                      >
                        🎧 <span>Join as Listener</span>
                      </button>
                      <div className="h-px bg-zinc-900 my-1" />
                      <button 
                        onClick={() => { setInitialRegisterRole('artist'); setCurrentView('register'); setShowSignUpDropdown(false); }}
                        className="w-full text-left text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                      >
                        🎸 <span>Join as Artist</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-400 font-medium hidden md:inline">Studio Node: <strong className="text-white">{user?.email}</strong></span>
              <button onClick={handleLogout} className="text-xs bg-zinc-900 text-zinc-400 font-bold py-2 px-4 rounded-full border border-zinc-800 transition-all">Sign Out</button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 min-h-0 p-2 gap-2">
        <Sidebar userRole={user?.role || 'guest'} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 bg-gradient-to-b from-zinc-900/60 to-black rounded-xl overflow-y-auto flex flex-col border border-zinc-900/40">
          <main className="p-6 flex-1">
            {activeTab === 'home' && (
              <div className="p-6 mb-6 rounded-xl bg-gradient-to-r from-purple-950/20 via-zinc-900/50 to-transparent border border-purple-500/10">
                <h2 className="text-2xl font-black text-white">Uncover Fresh Waves</h2>
                <p className="text-zinc-400 text-xs mt-1">Streaming live global hits directly from official metadata networks, synced with community creators.</p>
              </div>
            )}

            {user?.role === 'artist' ? (
              <ArtistView activeTab={activeTab} tracks={filteredTracks} currentTrack={currentTrack} isPlaying={isPlaying} onPlayTrack={handlePlayTrack} refreshTracks={loadTracks} />
            ) : (
              <ListenerView activeTab={activeTab} tracks={filteredTracks} currentTrack={currentTrack} isPlaying={isPlaying} onPlayTrack={handlePlayTrack} />
            )}
          </main>
        </div>
      </div>

      <footer className="h-24 bg-zinc-950 border-t border-zinc-900 px-6 flex items-center justify-between z-10">
        
        {/* Left — Current Track Info */}
        <div className="w-1/4 flex items-center gap-3">
          {currentTrack ? (
            <>
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden flex items-center justify-center text-sm">
                {currentTrack.imageUrl ? <img src={currentTrack.imageUrl} alt="" className="w-full h-full object-cover" /> : '🎵'}
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

        {/* Center — Player Controls */}
        <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const idx = tracks.findIndex(t => t._id === currentTrack?._id);
                const prev = tracks[idx - 1];
                if (prev) handlePlayTrack(prev);
              }}
              disabled={!currentTrack}
              className="text-zinc-400 hover:text-white transition disabled:opacity-30 text-lg"
            >
              ⏮️
            </button>

            <button
              onClick={() => currentTrack && handlePlayTrack(currentTrack)}
              disabled={!currentTrack}
              className="w-10 h-10 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow font-bold text-sm"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>

            <button
              onClick={() => {
                const idx = tracks.findIndex(t => t._id === currentTrack?._id);
                const next = tracks[idx + 1];
                if (next) handlePlayTrack(next);
              }}
              disabled={!currentTrack}
              className="text-zinc-400 hover:text-white transition disabled:opacity-30 text-lg"
            >
              ⏭️
            </button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-[10px] text-zinc-500 w-8 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {
                audio.currentTime = Number(e.target.value);
                setCurrentTime(Number(e.target.value));
              }}
              className="flex-1 h-1 accent-purple-500 cursor-pointer"
            />
            <span className="text-[10px] text-zinc-500 w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right — Volume Control */}
        <div className="w-1/4 flex items-center justify-end gap-2">
          <span className="text-zinc-400 text-sm">🔊</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              audio.volume = val;
              setVolume(val);
            }}
            className="w-24 h-1 accent-purple-500 cursor-pointer"
          />
        </div>
      </footer>
    </div>
  );
}