'use client';

import { useState } from 'react';
import { Globe, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Window from './Window';

interface BrowserWindowProps {
  zIndex?: number;
  onFocus?: () => void;
}

export default function BrowserWindow({ zIndex = 10, onFocus }: BrowserWindowProps) {
  const [url] = useState('https://bing.com');

  return (
    <Window
      title="Bing - Search"
      icon={<Globe size={14} />}
      defaultPosition={{ x: window.innerWidth - 460, y: 80 }}
      defaultSize={{ width: 420, height: 380 }}
      zIndex={zIndex}
      onFocus={onFocus}
    >
      <div className="flex flex-col h-full bg-[#202020]">
        {/* Browser toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] border-b border-white/5">
          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <button className="p-1 rounded text-white/40 hover:text-white/60 hover:bg-white/5">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 rounded text-white/40 hover:text-white/60 hover:bg-white/5">
              <ChevronRight size={16} />
            </button>
            <button className="p-1 rounded text-white/40 hover:text-white/60 hover:bg-white/5">
              <RefreshCw size={14} />
            </button>
          </div>

          {/* URL bar */}
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] rounded-full">
            <Globe size={12} className="text-white/40" />
            <span className="text-xs text-white/60 truncate">{url}</span>
          </div>
        </div>

        {/* Browser content - Bing mockup (since iframe may be blocked) */}
        <div className="flex-1 flex flex-col items-center justify-start pt-12 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] overflow-hidden">
          {/* Bing logo mockup */}
          <div className="text-3xl font-light text-white mb-8 tracking-tight">
            <span className="text-white">Bing</span>
          </div>

          {/* Search bar mockup */}
          <div className="w-full max-w-[320px] flex items-center gap-3 px-4 py-3 bg-white/5 rounded-full border border-white/10">
            <Search size={18} className="text-white/40" />
            <span className="text-white/30 text-sm">Search the web</span>
          </div>

          {/* Quick links */}
          <div className="flex gap-4 mt-8">
            {['News', 'Images', 'Videos', 'Maps'].map((item) => (
              <span key={item} className="text-xs text-white/40 hover:text-white/60 cursor-pointer">
                {item}
              </span>
            ))}
          </div>

          {/* Trending section */}
          <div className="mt-8 w-full max-w-[320px]">
            <div className="text-xs text-white/30 mb-3">Trending now</div>
            <div className="space-y-2">
              {['AI Documentation Tools', 'Web Scraping Best Practices', 'Markdown Editors'].map((topic, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                  <span className="text-white/30">{i + 1}</span>
                  <span className="hover:text-white/70 cursor-pointer">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}
