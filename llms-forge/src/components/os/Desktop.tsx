'use client';

import { ReactNode } from 'react';
import Taskbar from './Taskbar';

interface DesktopProps {
  children: ReactNode;
  activeApps?: string[];
  onAppClick?: (appId: string) => void;
}

export default function Desktop({ children, activeApps = [], onAppClick }: DesktopProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none">
      {/* Premium mesh gradient background */}
      <div className="absolute inset-0 bg-[#08080c]">
        {/* Primary gradient mesh */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
              radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
              radial-gradient(at 0% 100%, rgba(34, 197, 94, 0.06) 0%, transparent 50%)
            `,
          }}
        />
        
        {/* Animated orbs */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
            top: '-20%',
            right: '-10%',
            animationDuration: '8s',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
            bottom: '-15%',
            left: '-5%',
            animationDuration: '10s',
            animationDelay: '2s',
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[80px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            top: '30%',
            left: '40%',
            animationDuration: '12s',
            animationDelay: '4s',
          }}
        />
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.012] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Desktop icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
        <DesktopIcon icon="📁" label="Files" onClick={() => onAppClick?.('files')} />
        <DesktopIcon icon="⚡" label="llm.energy" onClick={() => window.open('/', '_self')} />
      </div>

      {/* Version watermark */}
      <div className="absolute bottom-16 right-4 text-white/[0.03] text-xs font-mono pointer-events-none">
        llm.energy forge v2.0
      </div>

      {/* Window container */}
      <div className="relative w-full h-full pb-14">
        {children}
      </div>

      {/* Taskbar */}
      <Taskbar activeApps={activeApps} onAppClick={onAppClick} />
    </div>
  );
}

function DesktopIcon({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white/5 active:bg-white/10 transition-all group w-[72px]"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform drop-shadow-lg">{icon}</span>
      <span className="text-[10px] text-white/60 group-hover:text-white/80 text-center leading-tight font-medium">
        {label}
      </span>
    </button>
  );
}
