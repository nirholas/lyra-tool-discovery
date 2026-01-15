'use client';

import { useState, useEffect } from 'react';
import { Terminal, Code2, FolderOpen, Wifi, Volume2, Battery, Sparkles } from 'lucide-react';

interface TaskbarProps {
  activeApps?: string[];
  onAppClick?: (appId: string) => void;
}

export default function Taskbar({ activeApps = [], onAppClick }: TaskbarProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }));
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const dockApps = [
    { id: 'terminal', name: 'Terminal', icon: <Terminal size={20} />, color: '#22c55e' },
    { id: 'editor', name: 'Code Editor', icon: <Code2 size={20} />, color: '#3b82f6' },
    { id: 'files', name: 'Files', icon: <FolderOpen size={20} />, color: '#f59e0b' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div 
        className="h-14 flex items-center justify-between px-4"
        style={{
          background: 'linear-gradient(180deg, rgba(12, 12, 18, 0.8) 0%, rgba(8, 8, 12, 0.95) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-xs font-semibold text-white/70">llm.energy</span>
          </div>
        </div>

        {/* Center: Dock */}
        <div 
          className="flex items-center gap-1 px-2 py-1.5 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
          }}
        >
          {dockApps.map((app) => {
            const isActive = activeApps.includes(app.id);
            return (
              <button
                key={app.id}
                onClick={() => onAppClick?.(app.id)}
                className={`
                  relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-white/[0.08] scale-100' 
                    : 'hover:bg-white/[0.04] hover:scale-105'
                  }
                `}
                style={{ color: isActive ? app.color : 'rgba(255,255,255,0.5)' }}
                title={app.name}
              >
                {app.icon}
                {isActive && (
                  <div 
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: app.color, boxShadow: `0 0 6px ${app.color}` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: System tray */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-white/40">
            <Wifi size={15} className="hover:text-white/70 cursor-pointer transition-colors" />
            <Volume2 size={15} className="hover:text-white/70 cursor-pointer transition-colors" />
            <div className="flex items-center gap-1">
              <Battery size={15} />
              <span className="text-[11px] font-medium">100%</span>
            </div>
          </div>
          
          <div className="w-px h-5 bg-white/10" />
          
          <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-sm font-semibold text-white/80 tabular-nums tracking-tight">
              {currentTime}
            </span>
            <span className="text-[10px] text-white/40 font-medium">
              {currentDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
