import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan flex flex-col font-pixel selection:bg-magenta selection:text-black pb-24 relative overflow-hidden">
      <div className="scanline"></div>
      <header className="p-6 text-center tear-effect mt-4">
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-cyan glitch-text" data-text="SYS.SNAKE_PROTOCOL">
          SYS.SNAKE_PROTOCOL
        </h1>
        <div className="mt-4">
          <p className="text-magenta text-2xl uppercase tracking-widest bg-black inline-block px-4 py-1 border-2 border-magenta tear-effect">
            STATUS: ONLINE // AWAITING_INPUT
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <SnakeGame />
      </main>

      <MusicPlayer />
    </div>
  );
}
