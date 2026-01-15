'use client';

import { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import Window from './Window';

interface MusicPlayerProps {
  zIndex?: number;
  onFocus?: () => void;
}

export default function MusicPlayer({ zIndex = 10, onFocus }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);

  // Simulate progress bar animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <Window
      title="Music Player"
      icon={<Music size={14} />}
      defaultPosition={{ x: 40, y: window.innerHeight - 320 }}
      defaultSize={{ width: 300, height: 220 }}
      zIndex={zIndex}
      onFocus={onFocus}
    >
      <div className="flex flex-col h-full p-4 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
        {/* Album art and info */}
        <div className="flex gap-3 mb-4">
          {/* Album art placeholder */}
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-orange-500/20 flex items-center justify-center shrink-0">
            <Music size={24} className="text-white/40" />
          </div>
          
          {/* Track info */}
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-white text-sm font-medium truncate">
              lofi beats - coding session
            </span>
            <span className="text-white/50 text-xs truncate">
              ChillHop Music
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/60 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/40">
              {Math.floor(progress / 100 * 180 / 60)}:{String(Math.floor(progress / 100 * 180) % 60).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-white/40">3:00</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button className="text-white/60 hover:text-white/90 transition-colors">
            <SkipBack size={18} />
          </button>
          <button 
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button className="text-white/60 hover:text-white/90 transition-colors">
            <SkipForward size={18} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-white/40" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none 
              [&::-webkit-slider-thumb]:w-3 
              [&::-webkit-slider-thumb]:h-3 
              [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-white/80"
          />
          <span className="text-[10px] text-white/40 w-6 text-right">{volume}%</span>
        </div>
      </div>
    </Window>
  );
}
