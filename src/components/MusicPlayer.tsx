import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "DATA_STREAM_01",
    artist: "SYS_AUDIO_DAEMON",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "CORRUPT_SECTOR_AUDIO",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "VOID_RESONANCE",
    artist: "SYS_AUDIO_DAEMON",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t-4 border-magenta p-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-50 font-pixel uppercase">
      <div className="flex items-center gap-4 w-full sm:w-1/3">
        <div className="w-14 h-14 bg-black border-2 border-cyan flex items-center justify-center tear-effect shrink-0">
          <Music className="text-cyan" size={28} />
        </div>
        <div className="overflow-hidden border-l-2 border-magenta pl-3">
          <h3 className="text-cyan text-xl tracking-widest truncate">{currentTrack.title}</h3>
          <p className="text-magenta text-lg truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 w-full sm:w-1/3">
        <button onClick={prevTrack} className="text-cyan hover:text-magenta hover:scale-110 transition-none">
          <SkipBack size={32} />
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-16 bg-magenta text-black flex items-center justify-center hover:bg-cyan transition-none shrink-0 border-2 border-black tear-effect"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="text-cyan hover:text-magenta hover:scale-110 transition-none">
          <SkipForward size={32} />
        </button>
      </div>

      <div className="items-center justify-end gap-4 w-full sm:w-1/3 hidden sm:flex pr-4">
        <Volume2 className="text-magenta" size={24} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-32 accent-cyan cursor-pointer"
          style={{
            WebkitAppearance: 'none',
            background: '#ff00ff',
            height: '4px',
            outline: 'none'
          }}
        />
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
        loop={false}
      />
    </div>
  );
}
