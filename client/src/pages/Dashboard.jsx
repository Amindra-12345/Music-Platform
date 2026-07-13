import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ListenerView from '../components/ListenerView';
import ArtistView from '../components/ArtistView';

export default function Dashboard() {
  // 💡 Change this state hook string to 'listener' or 'artist' manually to toggle layouts instantly for testing!
  const [role, setRole] = useState('artist');
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex h-screen w-screen bg-black text-zinc-100 font-sans overflow-hidden select-none">
      {/* Structural Sidebar Menu */}
      <Sidebar userRole={role} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workplace Body Frame */}
      <div className="flex-1 flex flex-col h-full bg-zinc-900/40">
        
        {/* Dynamic Context Header Bar */}
        <header className="h-16 border-b border-zinc-850 px-8 flex justify-between items-center bg-zinc-950/30">
          <div>
            <span className="text-xs text-zinc-500 font-medium tracking-wide">Workspace / {activeTab}</span>
          </div>
          
          {/* Quick UI Role Toggle Switcher for testing purposes */}
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button 
              onClick={() => { setRole('listener'); setActiveTab('home'); }}
              className={`text-xs px-3 py-1 rounded font-medium transition-all ${role === 'listener' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Listener Mode
            </button>
            <button 
              onClick={() => { setRole('artist'); setActiveTab('home'); }}
              className={`text-xs px-3 py-1 rounded font-medium transition-all ${role === 'artist' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Artist Mode
            </button>
          </div>
        </header>

        {/* Content View Routing Node */}
        <main className="flex-1 p-8 overflow-y-auto">
          {role === 'artist' ? (
            <ArtistView activeTab={activeTab} />
          ) : (
            <ListenerView activeTab={activeTab} />
          )}
        </main>
      </div>
    </div>
  );
}