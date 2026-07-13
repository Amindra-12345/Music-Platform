import React, { useState, useEffect } from 'react';
import { Home, Search, Library, Plus, Disc, User, LogOut, Upload, Play, Pause, Music, Sliders } from 'lucide-react';
import { loginUser, registerUser, fetchTracks, uploadTrackFile } from './services/api';

export default function App() {
  // Auth & UI States
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Track States
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());

  // Upload States (For Artists)
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [file, setFile] = useState(null);

  // Load tracks when authenticated
  useEffect(() => {
    if (token) {
      // Decode rudimentary user data from token if needed, or fetch data. 
      // For simplicity, we flag as logged in. Reality would fetch profile.
      setUser({ email: localStorage.getItem('userEmail') || 'User', role: localStorage.getItem('userRole') || 'listener' });
      loadTracks();
    }
  }, [token]);

  const loadTracks = async () => {
    try {
      const res = await fetchTracks();
      setTracks(res.data);
    } catch (err) {
      console.error("Error loading music:", err);
    }
  };

  // Audio Playback Controller
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
      audio.src = `http://localhost:5000${track.filePath}`;
      audio.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      localStorage.setItem('userEmail', res.data.user.email);
      setToken(res.data.token);
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title || !genre) return alert("Please fill all fields!");
    const formData = new FormData();
    formData.append('title', title);
    formData.append('genre', genre);
    formData.append('audio', file);

    try {
      await uploadTrackFile(formData);
      alert("Track uploaded successfully!");
      setTitle(''); setGenre(''); setFile(null);
      loadTracks();
    } catch (err) {
      alert("Upload failed!");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUser(null);
    audio.pause();
    setIsPlaying(false);
  };

  // --- RENDERING GATE: AUTHENTICATION WINDOW ---
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white font-sans px-4">
        <div className="w-full max-w-md p-8 bg-[#181818] rounded-lg shadow-xl border border-[#282828]">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Disc className="text-[#1ED760] animate-spin-slow" size={40} />
            <h1 className="text-3xl font-bold tracking-tight">SoundStream</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 rounded bg-[#3e3e3e] border border-transparent focus:border-[#777] focus:outline-none text-sm transition-all" placeholder="name@domain.com"/>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => parseInt(e.target.value) ? null : setPassword(e.target.value)} required className="w-full p-3 rounded bg-[#3e3e3e] border border-transparent focus:border-[#777] focus:outline-none text-sm transition-all" placeholder="••••••••"/>
            </div>
            <button type="submit" className="w-full py-3 bg-[#1ED760] text-black font-bold rounded-full hover:scale-102 hover:bg-[#1fdf64] active:scale-98 transition-all text-base tracking-wide mt-2">
              Log In
            </button>
          </form>
          <p className="text-xs text-center text-[#b3b3b3] mt-6">Use registered database accounts to gain access profile.</p>
        </div>
      </div>
    );
  }

  // --- MAIN APP DESKTOP WINDOW LAYOUT ---
  return (
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden select-none">
      
      {/* Upper Wrapper (Sidebar + Core View Panel) */}
      <div className="flex flex-1 min-h-0 p-2 gap-2">
        
        {/* Left Nav Menu Sidebar */}
        <aside className="w-64 bg-[#121212] rounded-lg flex flex-col justify-between p-4 space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2 text-[#1ED760]">
              <Disc size={28} />
              <span className="font-bold text-xl tracking-tight text-white">SoundStream</span>
            </div>
            
            <nav className="space-y-3">
              <button className="flex items-center gap-4 w-full px-2 py-2 font-bold text-[#b3b3b3] hover:text-white transition-colors text-sm"><Home size={22}/> Home</button>
              <button className="flex items-center gap-4 w-full px-2 py-2 font-bold text-[#b3b3b3] hover:text-white transition-colors text-sm"><Search size={22}/> Search</button>
              <button className="flex items-center gap-4 w-full px-2 py-2 font-bold text-[#b3b3b3] hover:text-white transition-colors text-sm"><Library size={22}/> Your Library</button>
            </nav>

            <div className="pt-4 border-t border-[#282828] space-y-3">
              <button className="flex items-center gap-4 w-full px-2 py-2 text-xs font-semibold text-[#b3b3b3] hover:text-white transition-colors"><Plus className="bg-[#b3b3b3] text-black p-0.5 rounded-sm" size={18}/> Create Playlist</button>
              <button className="flex items-center gap-4 w-full px-2 py-2 text-xs font-semibold text-[#b3b3b3] hover:text-white transition-colors"><Music className="bg-gradient-to-br from-indigo-600 to-purple-400 p-0.5 rounded-sm" size={18}/> Liked Songs</button>
            </div>
          </div>

          {/* Sidebar Footer Account Node */}
          <div className="bg-[#181818] p-3 rounded-md flex items-center justify-between border border-[#242424]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-[#1ED760] font-bold shrink-0">
                <User size={16}/>
              </div>
              <div className="truncate text-xs">
                <p className="font-bold text-white truncate">{user?.email}</p>
                <span className="text-[10px] text-[#b3b3b3] capitalize bg-[#282828] px-1.5 py-0.5 rounded-full mt-0.5 inline-block">{user?.role} Portal</span>
              </div>
            </div>
            <button onClick={handleLogout} className="text-[#b3b3b3] hover:text-red-500 transition-colors p-1"><LogOut size={16}/></button>
          </div>
        </aside>

        {/* Core Screen Space Dashboard */}
        <main className="flex-1 bg-gradient-to-b from-[#222] to-[#121212] rounded-lg overflow-y-auto p-6 scrollbar-thin">
          
          {/* Section: Dynamic Creator Studio Form for Artists */}
          {user?.role === 'artist' && (
            <section className="mb-8 p-6 bg-[#181818] bg-opacity-40 backdrop-blur rounded-lg border border-[#282828]">
              <div className="flex items-center gap-2 mb-4 text-[#1ED760]">
                <Upload size={20} />
                <h2 className="text-xl font-bold text-white">Creator Studio Dashboard</h2>
              </div>
              <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b3b3b3] mb-1.5">Song Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 text-xs rounded bg-[#282828] border border-transparent focus:border-[#555] focus:outline-none"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b3b3b3] mb-1.5">Genre Classification</label>
                  <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required className="w-full p-2 text-xs rounded bg-[#282828] border border-transparent focus:border-[#555] focus:outline-none" placeholder="e.g., Pop, Synthwave"/>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b3b3b3] mb-1.5">Audio Payload (.mp3)</label>
                  <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} required className="w-full text-xs text-[#b3b3b3] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#3e3e3e] file:text-white hover:file:bg-[#4e4e4e] cursor-pointer"/>
                </div>
                <button type="submit" className="w-full py-2 bg-[#1ED760] text-black text-xs font-bold rounded-full hover:scale-102 transition-transform shadow-md">Deploy Track</button>
              </form>
            </section>
          )}

          {/* Track Listing Grid */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Discover Music</h2>
            {tracks.length === 0 ? (
              <div className="text-center py-12 text-[#b3b3b3] border border-dashed border-[#282828] rounded-lg">
                <Music size={40} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No streamable media files discovered on storage stack.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {tracks.map((track) => {
                  const isThisTrackPlaying = currentTrack?._id === track._id && isPlaying;
                  return (
                    <div key={track._id} onClick={() => handlePlayTrack(track)} className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] cursor-pointer transition-all group relative shadow-md">
                      <div className="aspect-square bg-[#282828] rounded-md flex items-center justify-center mb-4 relative shadow-inner">
                        <Music size={40} className={`${isThisTrackPlaying ? 'text-[#1ED760]' : 'text-[#888]'}`} />
                        <button className="absolute bottom-2 right-2 p-3 bg-[#1ED760] text-black rounded-full opacity-0 shadow-xl group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                          {isThisTrackPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" />}
                        </button>
                      </div>
                      <h3 className="font-bold text-sm truncate text-white mb-1">{track.title}</h3>
                      <p className="text-xs text-[#b3b3b3] truncate font-medium capitalize">{track.genre || 'Unknown'}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* --- FLOATING TRACK BAR PLAYER FOOTER --- */}
      <footer className="h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between">
        
        {/* Track Title Panel Context */}
        <div className="w-1/4 flex items-center gap-3">
          {currentTrack ? (
            <>
              <div className="w-14 h-14 bg-[#282828] rounded flex items-center justify-center text-[#1ED760] shadow">
                <Music size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
                <p className="text-xs text-[#b3b3b3] truncate capitalize">{currentTrack.genre}</p>
              </div>
            </>
          ) : (
            <span className="text-xs text-[#b3b3b3]">No audio target streaming</span>
          )}
        </div>

        {/* Audio Interface Action Control Core */}
        <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
          <div className="flex items-center gap-5">
            <button 
              disabled={!currentTrack} 
              onClick={() => currentTrack && handlePlayTrack(currentTrack)} 
              className="p-2 bg-white text-black rounded-full hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-transform shadow"
            >
              {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
            </button>
          </div>
          <div className="w-full flex items-center gap-2 text-[10px] text-[#b3b3b3]">
            <span>0:00</span>
            <div className="flex-1 h-1 bg-[#3e3e3e] rounded-full overflow-hidden relative">
              <div className={`h-full bg-white group-hover:bg-[#1ED760] transition-colors ${isPlaying ? 'w-1/3' : 'w-0'}`}></div>
            </div>
            <span>3:45</span>
          </div>
        </div>

        {/* Right Speaker Control Pane Utility */}
        <div className="w-1/4 flex items-center justify-end gap-3 text-[#b3b3b3]">
          <Sliders size={16} className="hover:text-white cursor-pointer"/>
          <div className="w-20 h-1 bg-[#3e3e3e] rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-white"></div>
          </div>
        </div>
      </footer>

    </div>
  );
}