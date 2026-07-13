import React, { useState } from 'react';
import axios from 'axios';

export default function ArtistView({ activeTab, tracks, currentTrack, isPlaying, onPlayTrack, refreshTracks }) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [accessMode, setAccessMode] = useState('open');
  const [audioFile, setAudioFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      setStatusMessage('❌ Please select an audio file first.');
      return;
    }

    setLoading(true);
    setStatusMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('genre', genre);
    formData.append('accessMode', accessMode);
    formData.append('audio', audioFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/tracks/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setStatusMessage(`🎉 ${response.data.message}`);
      setTitle('');
      setGenre('');
      setAccessMode('open');
      setAudioFile(null);
      e.target.reset();
      
      if (refreshTracks) refreshTracks(); // Pull latest catalog update
    } catch (error) {
      setStatusMessage(error.response?.data?.message || '❌ Upload execution failed.');
    } finally {
      setLoading(false);
    }
  };

  if (activeTab === 'upload') {
    return (
      <div className="max-w-2xl bg-zinc-900 border border-zinc-850 rounded-2xl p-6 space-y-4 animate-fadeIn">
        <div>
          <h2 className="text-xl font-bold text-white">Publish a New Track</h2>
          <p className="text-zinc-400 text-xs">Upload your audio file directly to make it instantly streamable.</p>
        </div>
        
        <form className="space-y-4 pt-2" onSubmit={handleUploadSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Track Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 text-sm rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500" 
                placeholder="e.g., Summer Chill" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Genre</label>
              <input 
                type="text" 
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 text-sm rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500" 
                placeholder="e.g., Lo-Fi" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Access Mode</label>
            <select 
              value={accessMode}
              onChange={(e) => setAccessMode(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-sm rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="open">🔓 Open (Anyone can listen)</option>
              <option value="approval">🔒 Approval Required</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Select Audio File</label>
            <input 
              type="file" 
              accept="audio/*" 
              onChange={handleFileChange}
              required
              className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 transition-colors cursor-pointer" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-all shadow-md"
          >
            {loading ? 'Uploading Content...' : 'Upload & Publish'}
          </button>
        </form>

        {statusMessage && (
          <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-center font-medium text-zinc-300">
            {statusMessage}
          </div>
        )}
      </div>
    );
  }

  // Fallback / default 'home' or 'catalog' dynamic layout
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white">Artist Studio Dashboard</h2>
        <p className="text-zinc-400 text-sm">Monitor how your tracks are doing across the platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-zinc-900 border border-zinc-850 rounded-xl">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Tracks Published</p>
          <h3 className="text-3xl font-bold mt-1 text-white">{tracks.length}</h3>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden">
        <h3 className="p-4 bg-zinc-950/40 text-sm font-semibold border-b border-zinc-850 text-white">Your Released Catalog</h3>
        <table className="w-full text-left text-sm text-zinc-300">
          <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs border-b border-zinc-850">
            <tr>
              <th className="px-6 py-3.5">Title</th>
              <th className="px-6 py-3.5">Genre</th>
              <th className="px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {tracks.map((track) => (
              <tr key={track._id || track.id} className="hover:bg-zinc-850/20 transition-colors">
                <td className="px-6 py-4 font-medium text-white">💿 {track.title}</td>
                <td className="px-6 py-4 text-zinc-400">{track.genre}</td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onPlayTrack(track)}
                    className="text-xs font-bold text-purple-400 hover:underline"
                  >
                    {currentTrack?._id === track._id && isPlaying ? 'Pause ⏸️' : 'Play ▶️'}
                  </button>
                </td>
              </tr>
            ))}
            {tracks.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-zinc-500 text-xs">No tracks in database yet. Move to Upload Studio!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}