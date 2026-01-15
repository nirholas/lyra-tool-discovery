'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, Download, FileText, FolderArchive, FileCode, Settings } from 'lucide-react';
import Window from './Window';
import type { ExtractionState, ExtractionResult } from '@/types/extraction';

interface TerminalWindowProps {
  url: string | null;
  state: ExtractionState;
  onComplete?: (result: ExtractionResult) => void;
  zIndex?: number;
  onFocus?: () => void;
}

export default function TerminalWindow({ 
  url, 
  state, 
  onComplete,
  zIndex = 20,
  onFocus,
}: TerminalWindowProps) {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [showDownloads, setShowDownloads] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for logs
  useEffect(() => {
    if (currentLogIndex < state.logs.length) {
      const timer = setTimeout(() => {
        const log = state.logs[currentLogIndex];
        const prefix = log.type === 'success' ? '[OK]' : 
                      log.type === 'error' ? '[ERROR]' : 
                      log.type === 'warning' ? '[WARN]' : '[INFO]';
        const color = log.type === 'success' ? 'text-green-400' : 
                     log.type === 'error' ? 'text-red-400' : 
                     log.type === 'warning' ? 'text-yellow-400' : 'text-white/70';
        
        setDisplayedLogs(prev => [...prev, `<span class="${color}">${prefix}</span> ${log.message}`]);
        setCurrentLogIndex(prev => prev + 1);
      }, 80);
      
      return () => clearTimeout(timer);
    }
  }, [state.logs, currentLogIndex]);

  // Show downloads when complete
  useEffect(() => {
    if (state.status === 'complete') {
      const timer = setTimeout(() => setShowDownloads(true), 500);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  // Generate progress bar
  const generateProgressBar = (progress: number) => {
    const filled = Math.floor(progress / 5);
    const empty = 20 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  const hostname = url ? new URL(url).hostname : 'docs.example.com';

  return (
    <Window
      title={`Terminal - Extracting ${hostname}`}
      icon={<Terminal size={14} />}
      defaultPosition={{ x: Math.max(100, (window.innerWidth - 700) / 2), y: 60 }}
      defaultSize={{ width: 700, height: 500 }}
      zIndex={zIndex}
      onFocus={onFocus}
    >
      <div className="flex flex-col h-full bg-[#0a0a0a] font-mono text-sm">
        {/* Terminal content */}
        <div 
          ref={terminalRef}
          className="flex-1 p-4 overflow-y-auto space-y-1"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Command prompt */}
          <div className="text-green-400">
            $ llm-energy extract {url || 'https://docs.example.com'}
          </div>
          <div className="h-4" />

          {/* Logs with typewriter effect */}
          {displayedLogs.map((log, i) => (
            <div 
              key={i} 
              className="text-white/90"
              dangerouslySetInnerHTML={{ __html: log }}
            />
          ))}

          {/* Progress bar (shown during fetching/processing) */}
          {(state.status === 'fetching' || state.status === 'processing') && (
            <div className="mt-4">
              <div className="text-cyan-400">
                {generateProgressBar(state.progress)} {state.progress}%
              </div>
            </div>
          )}

          {/* Completion message */}
          {state.status === 'complete' && state.result && (
            <div className="mt-4 space-y-2">
              <div className="text-green-400 font-bold">[SUCCESS] Extraction complete!</div>
              <div className="h-2" />
              <div className="text-white/70">Generated files:</div>
              <div className="text-white/90 pl-2">
                📄 FULL-DOCUMENTATION.md ({Math.round(state.result.stats.totalCharacters / 1024)} KB)
              </div>
              <div className="text-white/90 pl-2">
                📁 sections/
              </div>
              {state.result.documents.slice(0, 3).map((doc, i) => (
                <div key={i} className="text-white/60 pl-6">
                  ├── {String(i + 1).padStart(2, '0')}-{doc.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}.md
                </div>
              ))}
              {state.result.documents.length > 3 && (
                <div className="text-white/60 pl-6">
                  └── ... {state.result.documents.length - 3} more files
                </div>
              )}
              <div className="text-white/90 pl-2">📋 AGENT-PROMPT.md</div>
              <div className="text-white/90 pl-2">⚙️  mcp-config.json</div>
              <div className="h-4" />
              <div className="text-white/50">[Click below to download]</div>
            </div>
          )}

          {/* Error message */}
          {state.status === 'error' && (
            <div className="mt-4 space-y-2">
              <div className="text-red-400 font-bold">[ERROR] Extraction failed</div>
              <div className="text-red-300">{state.error || 'An unknown error occurred'}</div>
            </div>
          )}

          {/* Blinking cursor */}
          {state.status !== 'complete' && state.status !== 'error' && (
            <span className="inline-block w-2 h-4 bg-white/80 animate-pulse" />
          )}
        </div>

        {/* Download panel overlay */}
        {showDownloads && state.result && (
          <div className="border-t border-white/10 p-4 bg-[#111111]">
            <div className="flex flex-wrap gap-2">
              <DownloadButton 
                icon={<FileText size={14} />}
                label="Full Documentation"
                sublabel=".md"
                onClick={() => downloadFile('FULL-DOCUMENTATION.md', state.result!.fullDocument)}
              />
              <DownloadButton 
                icon={<FolderArchive size={14} />}
                label="All Files"
                sublabel=".zip"
                onClick={() => downloadZip(state.result!, hostname)}
              />
              <DownloadButton 
                icon={<FileCode size={14} />}
                label="Agent Prompt"
                sublabel=".md"
                onClick={() => downloadFile('AGENT-PROMPT.md', state.result!.agentPrompt)}
              />
              <DownloadButton 
                icon={<Settings size={14} />}
                label="MCP Config"
                sublabel=".json"
                onClick={() => downloadFile('mcp-config.json', state.result!.mcpConfig)}
              />
            </div>
          </div>
        )}
      </div>
    </Window>
  );
}

function DownloadButton({ 
  icon, 
  label, 
  sublabel, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  sublabel: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
    >
      <span className="text-white/60">{icon}</span>
      <div className="text-left">
        <div className="text-xs text-white/90">{label}</div>
        <div className="text-[10px] text-white/40">{sublabel}</div>
      </div>
      <Download size={12} className="text-white/40 ml-1" />
    </button>
  );
}

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadZip(result: ExtractionResult, siteName: string) {
  // Dynamic import JSZip
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  
  const folderName = siteName.replace(/\./g, '-') + '-docs';
  const folder = zip.folder(folderName);
  
  if (folder) {
    folder.file('FULL-DOCUMENTATION.md', result.fullDocument);
    folder.file('AGENT-PROMPT.md', result.agentPrompt);
    folder.file('mcp-config.json', result.mcpConfig);
    
    const sectionsFolder = folder.folder('sections');
    if (sectionsFolder) {
      result.documents.forEach((doc, i) => {
        const filename = `${String(i + 1).padStart(2, '0')}-${doc.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}.md`;
        sectionsFolder.file(filename, doc.content);
      });
    }
  }
  
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
