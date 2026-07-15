import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

export default function Register({ setToken, isLoginView, setIsLoginView, defaultRole }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(defaultRole || 'listener');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLoginView) {
        const res = await loginUser({ email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', res.data.user.role);
        localStorage.setItem('userEmail', res.data.user.email);
        setToken(res.data.token);
      } else {
        await registerUser({ name, email, password, role });
        alert('Registration successful! Please log in.');
        setIsLoginView(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white px-4">
      <div className="w-full max-w-md p-8 bg-[#181818] rounded-lg shadow-xl border border-[#282828]">
        
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-3xl">🎵</span>
          <h1 className="text-3xl font-bold tracking-tight">SoundSoul</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 rounded bg-[#3e3e3e] text-sm text-white focus:outline-none"
                placeholder="Your Name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 rounded bg-[#3e3e3e] text-sm text-white focus:outline-none"
              placeholder="name@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 rounded bg-[#3e3e3e] text-sm text-white focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {!isLoginView && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`p-3 rounded border text-center cursor-pointer transition-all ${role === 'listener' ? 'border-[#1ED760] text-[#1ED760] bg-[#282828]' : 'border-transparent bg-[#3e3e3e] text-[#b3b3b3]'}`}>
                  <input type="radio" name="role" value="listener" checked={role === 'listener'} onChange={() => setRole('listener')} className="hidden" />
                  <span className="text-xs font-bold">🎧 Listener</span>
                </label>
                <label className={`p-3 rounded border text-center cursor-pointer transition-all ${role === 'artist' ? 'border-[#1ED760] text-[#1ED760] bg-[#282828]' : 'border-transparent bg-[#3e3e3e] text-[#b3b3b3]'}`}>
                  <input type="radio" name="role" value="artist" checked={role === 'artist'} onChange={() => setRole('artist')} className="hidden" />
                  <span className="text-xs font-bold">🎙️ Artist</span>
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1ED760] text-black font-bold rounded-full hover:bg-[#1fdf64] transition-all mt-4 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLoginView ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div className="text-xs text-center text-[#b3b3b3] mt-5">
          {isLoginView ? (
            <p>No account? <button onClick={() => setIsLoginView(false)} className="text-[#1ED760] underline font-semibold">Sign up</button></p>
          ) : (
            <p>Already registered? <button onClick={() => setIsLoginView(true)} className="text-[#1ED760] underline font-semibold">Log in</button></p>
          )}
        </div>
      </div>
    </div>
  );
}