'use client';

import { ReactNode, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';

interface WindowProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  zIndex?: number;
  minimized?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  className?: string;
  accentColor?: string;
}

export default function Window({
  title,
  icon,
  children,
  defaultPosition,
  defaultSize,
  zIndex = 10,
  minimized = false,
  onClose,
  onMinimize,
  onFocus,
  className = '',
  accentColor = '#6366f1',
}: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);

  if (minimized) {
    return null;
  }

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />
      
      <motion.div
        drag={!isMaximized}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        initial={{ 
          x: defaultPosition.x, 
          y: defaultPosition.y,
          opacity: 0,
          scale: 0.96,
        }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          width: isMaximized ? '100vw' : defaultSize.width,
          height: isMaximized ? 'calc(100vh - 56px)' : defaultSize.height,
          x: isMaximized ? 0 : undefined,
          y: isMaximized ? 0 : undefined,
          borderRadius: isMaximized ? 0 : 12,
        }}
        transition={{ 
          type: 'spring', 
          damping: 30, 
          stiffness: 400,
          opacity: { duration: 0.15 },
        }}
        style={{ 
          position: 'absolute',
          zIndex,
          width: defaultSize.width,
          height: defaultSize.height,
        }}
        className={`flex flex-col overflow-hidden ${className}`}
        onPointerDown={onFocus}
      >
        {/* Window border glow effect */}
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: `
              0 0 0 1px rgba(0, 0, 0, 0.3),
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              0 0 100px -20px ${accentColor}15
            `,
          }}
        />

        {/* Title bar */}
        <div 
          className="flex items-center justify-between h-10 px-3 shrink-0 cursor-move select-none relative z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(30, 30, 35, 0.95) 0%, rgba(22, 22, 28, 0.98) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          {/* Left: Window controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onClose?.(); }}
              className="group flex items-center justify-center w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff4040] transition-colors"
              title="Close"
            >
              <X size={8} className="opacity-0 group-hover:opacity-100 text-black/60 transition-opacity" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
              className="group flex items-center justify-center w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#fea500] transition-colors"
              title="Minimize"
            >
              <Minus size={8} className="opacity-0 group-hover:opacity-100 text-black/60 transition-opacity" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
              className="group flex items-center justify-center w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#1aab29] transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? (
                <Minimize2 size={7} className="opacity-0 group-hover:opacity-100 text-black/60 transition-opacity" />
              ) : (
                <Maximize2 size={7} className="opacity-0 group-hover:opacity-100 text-black/60 transition-opacity" />
              )}
            </button>
          </div>

          {/* Center: Title */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/80">
            {icon && <span className="text-white/50">{icon}</span>}
            <span className="text-[13px] font-medium truncate max-w-[300px]">{title}</span>
          </div>

          {/* Right: Spacer */}
          <div className="w-16" />
        </div>

        {/* Content area */}
        <div 
          className="flex-1 overflow-hidden relative"
          style={{
            background: 'linear-gradient(180deg, rgba(16, 16, 20, 0.98) 0%, rgba(12, 12, 16, 1) 100%)',
          }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
}
