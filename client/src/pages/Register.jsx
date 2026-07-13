import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'listener' // Default role is listener
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Direct call to your local express server endpoint
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(`🎉 Registration successful! Account type: ${response.data.user.role}`);
    } catch (error) {
      setMessage(error.response?.data?.message || '❌ Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-850 p-8 rounded-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="text-xs text-zinc-400 mt-1">Join as a listener to stream, or an artist to publish music.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1">Name</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-green-500" placeholder="Your Name" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1">Email</label>
            <input type="email" name="email" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-green-500" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-1">Password</label>
            <input type="password" name="password" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-green-500" placeholder="••••••••" />
          </div>

          {/* 🌟 The New Role Selector Section */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-2">Choose your account type</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Listener Card Option */}
              <label className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${formData.role === 'listener' ? 'border-green-500 bg-green-950/20' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
                <input type="radio" name="role" value="listener" checked={formData.role === 'listener'} onChange={handleChange} className="hidden" />
                <span className="text-xl mb-1">🎧</span>
                <span className="text-sm font-semibold text-white">Listener</span>
                <span className="text-[10px] text-zinc-400 mt-0.5">Stream & Aggregate</span>
              </label>

              {/* Artist Card Option */}
              <label className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${formData.role === 'artist' ? 'border-purple-500 bg-purple-950/20' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
                <input type="radio" name="role" value="artist" checked={formData.role === 'artist'} onChange={handleChange} className="hidden" />
                <span className="text-xl mb-1">🎙️</span>
                <span className="text-sm font-semibold text-white">Artist</span>
                <span className="text-[10px] text-zinc-400 mt-0.5">Upload & Manage</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black text-sm font-bold py-3 rounded-lg transition-all mt-2 shadow-md">
            Sign Up
          </button>
        </form>

        {message && (
          <div className="p-3 bg-zinc-950 border border-zinc-850 rounded-lg text-xs text-center font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}