import React, { useState } from 'react';
// import axios from 'axios'; // connect backend endpoints here

export default function Register({ setToken, isLoginView, setIsLoginView, defaultRole }) {
  const [role, setRole] = useState(defaultRole || 'listener');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Execute backend requests here...
    console.log("Submitting:", { email, password, role, isLoginView });
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">
          {isLoginView ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          {isLoginView ? 'Sign in to manage your music catalog' : 'Join our collaborative system'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Hide Role selection if doing a simple login */}
        {!isLoginView && (
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Select Your Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('listener')}
                className={`py-2 text-sm font-semibold rounded-lg border transition-all ${
                  role === 'listener' ? 'bg-white text-black border-white' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                🎧 Listener
              </button>
              <button
                type="button"
                onClick={() => setRole('artist')}
                className={`py-2 text-sm font-semibold rounded-lg border transition-all ${
                  role === 'artist' ? 'bg-purple-600 text-white border-purple-600' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                🎵 Artist Studio
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Email Address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-sm rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-600"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-sm rounded-lg p-2.5 text-white focus:outline-none focus:border-zinc-600"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-black text-sm font-bold py-2.5 rounded-full transition-all mt-2">
          {isLoginView ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      {/* Navigation Switch Links */}
      <div className="text-center pt-2 text-xs">
        {isLoginView ? (
          <p className="text-zinc-400">
            Don't have an account yet?{' '}
            <button onClick={() => setIsLoginView(false)} className="text-green-400 font-semibold hover:underline bg-transparent border-0 cursor-pointer">
              Register Now
            </button>
          </p>
        ) : (
          <p className="text-zinc-400">
            Already have an account?{' '}
            <button onClick={() => setIsLoginView(true)} className="text-green-400 font-semibold hover:underline bg-transparent border-0 cursor-pointer">
              Sign In Here
            </button>
          </p>
        )}
      </div>
    </div>
  );
}