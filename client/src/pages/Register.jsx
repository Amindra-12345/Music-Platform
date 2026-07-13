import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

export default function Register({ setToken, isLoginView, setIsLoginView }) {
  // Local form input tracking states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('listener'); // 'listener' or 'artist'
  const [isLoading, setIsLoading] = useState(false);

  // Form submission dispatcher
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(false);

    if (isLoginView) {
      // --- LOGIN SEQUENCE ---
      try {
        const res = await loginUser({ email, password });
        
        // Cache session tokens in standard storage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', res.data.user.role);
        localStorage.setItem('userEmail', res.data.user.email);
        
        // Elevate authorization token to clear parent rendering gate
        setToken(res.data.token);
      } catch (err) {
        alert(err.response?.data?.message || "Invalid authentication credentials!");
      }
    } else {
      // --- REGISTRATION SEQUENCE ---
      try {
        await registerUser({ name, email, password, role });
        alert("Registration successful! Flipping to credentials verification panel...");
        
        // Reset name buffer and pivot display back to the login card view
        setName('');
        setIsLoginView(true);
      } catch (err) {
        alert(err.response?.data?.message || "Profile creation sequence rejected!");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#121212] text-white font-sans px-4">
      <div className="w-full max-w-md p-8 bg-[#181818] rounded-lg shadow-xl border border-[#282828]">
        
        {/* Header Node */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-3xl animate-spin" style={{ animationDuration: '6s' }}>💿</span>
          <h1 className="text-3xl font-bold tracking-tight">SoundStream</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Conditionally reveal Full Name input field if inside Registration layout */}
          {!isLoginView && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="w-full p-2.5 rounded bg-[#3e3e3e] border border-transparent focus:border-[#777] focus:outline-none text-sm transition-all" 
                placeholder="Your Name"
              />
            </div>
          )}

          {/* Email input field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-1.5">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-2.5 rounded bg-[#3e3e3e] border border-transparent focus:border-[#777] focus:outline-none text-sm transition-all" 
              placeholder="name@domain.com"
            />
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-1.5">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-2.5 rounded bg-[#3e3e3e] border border-transparent focus:border-[#777] focus:outline-none text-sm transition-all" 
              placeholder="••••••••"
            />
          </div>

          {/* Conditionally reveal Role Selection radios if inside Registration layout */}
          {!isLoginView && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-2">Select Portal Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Listener Choice */}
                <label className={`p-3 rounded border text-center cursor-pointer transition-all ${role === 'listener' ? 'bg-[#282828] border-[#1ED760] text-[#1ED760]' : 'bg-[#3e3e3e] border-transparent text-[#b3b3b3]'}`}>
                  <input type="radio" name="role" value="listener" checked={role === 'listener'} onChange={() => setRole('listener')} className="hidden" />
                  <span className="text-xs font-bold block">🎧 Listener</span>
                </label>
                
                {/* Artist Choice */}
                <label className={`p-3 rounded border text-center cursor-pointer transition-all ${role === 'artist' ? 'bg-[#282828] border-[#1ED760] text-[#1ED760]' : 'bg-[#3e3e3e] border-transparent text-[#b3b3b3]'}`}>
                  <input type="radio" name="role" value="artist" checked={role === 'artist'} onChange={() => setRole('artist')} className="hidden" />
                  <span className="text-xs font-bold block">🎙️ Artist Studio</span>
                </label>
                
              </div>
            </div>
          )}

          {/* Submission Trigger */}
          <button type="submit" className="w-full py-3 bg-[#1ED760] text-black font-bold rounded-full hover:scale-102 hover:bg-[#1fdf64] active:scale-98 transition-all text-base tracking-wide mt-4">
            {isLoginView ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {/* View Toggle Footer Interface */}
        <div className="text-xs text-center text-[#b3b3b3] mt-5">
          {isLoginView ? (
            <p>
              Don't have a profile yet?{' '}
              <button type="button" onClick={() => setIsLoginView(false)} className="text-[#1ED760] underline font-semibold bg-transparent border-0 cursor-pointer focus:outline-none">Sign up here</button>
            </p>
          ) : (
            <p>
              Already registered on the stack?{' '}
              <button type="button" onClick={() => setIsLoginView(true)} className="text-[#1ED760] underline font-semibold bg-transparent border-0 cursor-pointer focus:outline-none">Log in here</button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}