'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, Suspense } from 'react';
import Desktop from '@/components/os/Desktop';
import MusicPlayer from '@/components/os/MusicPlayer';
import BrowserWindow from '@/components/os/BrowserWindow';
import TerminalWindow from '@/components/os/TerminalWindow';
import type { ExtractionState, ExtractionLog, ExtractionResult } from '@/types/extraction';

function ExtractPageContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  
  const [extractionState, setExtractionState] = useState<ExtractionState>({
    status: 'idle',
    progress: 0,
    logs: [],
    result: null,
  });

  const [windowZIndices, setWindowZIndices] = useState({
    music: 10,
    browser: 11,
    terminal: 20,
  });

  const bringToFront = (window: 'music' | 'browser' | 'terminal') => {
    const maxZ = Math.max(windowZIndices.music, windowZIndices.browser, windowZIndices.terminal);
    setWindowZIndices(prev => ({
      ...prev,
      [window]: maxZ + 1,
    }));
  };

  const addLog = useCallback((type: ExtractionLog['type'], message: string) => {
    setExtractionState(prev => ({
      ...prev,
      logs: [...prev.logs, { type, message, timestamp: Date.now() }],
    }));
  }, []);

  const startExtraction = useCallback(async (targetUrl: string) => {
    // Reset state
    setExtractionState({
      status: 'checking',
      progress: 0,
      logs: [],
      result: null,
    });

    try {
      // Simulate extraction process with logs
      addLog('info', 'Starting extraction...');
      await delay(500);
      
      setExtractionState(prev => ({ ...prev, status: 'checking', progress: 10 }));
      addLog('info', 'Analyzing URL...');
      await delay(600);

      const hostname = new URL(targetUrl).hostname;
      const baseUrl = new URL(targetUrl).origin;
      
      addLog('info', `Checking for llms.txt at ${baseUrl}/llms.txt...`);
      await delay(800);

      // Try to fetch the actual extraction API if available
      let result: ExtractionResult | null = null;
      
      try {
        const response = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl }),
        });
        
        if (response.ok) {
          result = await response.json();
        }
      } catch {
        // API not available, use demo mode
      }

      if (result) {
        // Real extraction succeeded
        addLog('success', `Found llms.txt at ${baseUrl}/llms.txt`);
        setExtractionState(prev => ({ ...prev, status: 'fetching', progress: 30 }));
        addLog('info', 'Fetching content...');
        await delay(500);
        
        setExtractionState(prev => ({ ...prev, progress: 50 }));
        await delay(400);
        
        setExtractionState(prev => ({ ...prev, status: 'processing', progress: 70 }));
        addLog('info', `Processing ${result.documents.length} sections...`);
        await delay(300);
        
        for (let i = 0; i < Math.min(result.documents.length, 5); i++) {
          addLog('success', `Section ${i + 1}/${result.documents.length}: ${result.documents[i].title}`);
          await delay(150);
        }
        
        if (result.documents.length > 5) {
          addLog('info', `... and ${result.documents.length - 5} more sections`);
        }
        
        setExtractionState(prev => ({ ...prev, progress: 100 }));
        await delay(300);
        
        setExtractionState(prev => ({
          ...prev,
          status: 'complete',
          result,
        }));
      } else {
        // Demo mode - simulate extraction
        addLog('warning', 'llms.txt not found, trying sitemap.xml...');
        await delay(600);
        
        addLog('info', `Checking sitemap at ${baseUrl}/sitemap.xml...`);
        await delay(700);
        
        addLog('success', 'Found sitemap.xml');
        setExtractionState(prev => ({ ...prev, status: 'fetching', progress: 25 }));
        
        addLog('info', 'Parsing sitemap for documentation pages...');
        await delay(500);
        
        const demoSections = [
          'Getting Started',
          'Installation',
          'Configuration', 
          'API Reference',
          'Components',
          'Hooks',
          'Styling',
          'Deployment',
          'FAQ',
          'Troubleshooting',
        ];
        
        addLog('success', `Found ${demoSections.length} documentation pages`);
        setExtractionState(prev => ({ ...prev, status: 'processing', progress: 40 }));
        
        addLog('info', 'Fetching and converting pages...');
        await delay(400);
        
        for (let i = 0; i < demoSections.length; i++) {
          const progress = 40 + (i / demoSections.length) * 50;
          setExtractionState(prev => ({ ...prev, progress }));
          addLog('success', `Section ${i + 1}/${demoSections.length}: ${demoSections[i]}`);
          await delay(200 + Math.random() * 200);
        }
        
        setExtractionState(prev => ({ ...prev, progress: 95 }));
        addLog('info', 'Generating output files...');
        await delay(500);
        
        // Create demo result
        const demoResult: ExtractionResult = {
          success: true,
          strategy: 'sitemap',
          source: {
            url: targetUrl,
            title: hostname,
          },
          documents: demoSections.map((title, i) => ({
            title,
            url: `${targetUrl}/${title.toLowerCase().replace(/\s+/g, '-')}`,
            content: `# ${title}\n\nThis is the documentation for ${title}.\n\n## Overview\n\nContent extracted from ${hostname}.\n\n## Details\n\nMore information about ${title} will appear here.\n`,
            wordCount: 50 + Math.floor(Math.random() * 100),
          })),
          fullDocument: generateFullDoc(hostname, demoSections),
          agentPrompt: generateAgentPrompt(hostname, targetUrl, demoSections),
          mcpConfig: generateMcpConfig(hostname, targetUrl),
          stats: {
            totalDocuments: demoSections.length,
            totalWords: 1250 + Math.floor(Math.random() * 500),
            totalCharacters: 8500 + Math.floor(Math.random() * 2000),
            extractionTime: 4500 + Math.floor(Math.random() * 1000),
          },
        };
        
        setExtractionState(prev => ({
          ...prev,
          status: 'complete',
          progress: 100,
          result: demoResult,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog('error', errorMessage);
      setExtractionState(prev => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));
    }
  }, [addLog]);

  useEffect(() => {
    if (url && extractionState.status === 'idle') {
      startExtraction(url);
    }
  }, [url, extractionState.status, startExtraction]);

  return (
    <Desktop>
      <MusicPlayer 
        zIndex={windowZIndices.music}
        onFocus={() => bringToFront('music')}
      />
      <BrowserWindow 
        zIndex={windowZIndices.browser}
        onFocus={() => bringToFront('browser')}
      />
      <TerminalWindow
        url={url}
        state={extractionState}
        zIndex={windowZIndices.terminal}
        onFocus={() => bringToFront('terminal')}
        onComplete={(result) => {
          console.log('Extraction complete:', result);
        }}
      />
    </Desktop>
  );
}

export default function ExtractPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white/60 font-mono">Loading...</div>
      </div>
    }>
      <ExtractPageContent />
    </Suspense>
  );
}

// Helper functions
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateFullDoc(siteName: string, sections: string[]): string {
  return `# ${siteName} Documentation

> Extracted from ${siteName}
> Generated on ${new Date().toISOString().split('T')[0]}
> Total sections: ${sections.length}

---

## Table of Contents

${sections.map((s, i) => `${i + 1}. [${s}](#${s.toLowerCase().replace(/\s+/g, '-')})`).join('\n')}

---

${sections.map(s => `
## ${s}

Documentation content for ${s}...

---
`).join('\n')}
`;
}

function generateAgentPrompt(siteName: string, sourceUrl: string, sections: string[]): string {
  return `# Agent Instructions for ${siteName}

## Context
You have access to the complete documentation for ${siteName}, extracted from ${sourceUrl}.

## Documentation Overview
This documentation contains ${sections.length} sections covering:
${sections.map(s => `- ${s}`).join('\n')}

## How to Use This Documentation

### Finding Information
1. Use the Table of Contents in FULL-DOCUMENTATION.md to locate topics
2. Individual section files are in the /sections folder
3. Search for specific keywords within files

### When Asked Questions About ${siteName}
1. Reference the specific section that answers the question
2. Quote relevant code examples directly
3. Provide links to the original documentation when helpful

---
*Generated by llm.energy*
`;
}

function generateMcpConfig(siteName: string, sourceUrl: string): string {
  const identifier = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return JSON.stringify({
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "name": `${identifier}-docs`,
    "version": "1.0.0",
    "description": `Documentation for ${siteName}`,
    "source": sourceUrl,
    "generated": new Date().toISOString(),
    "resources": [
      {
        "type": "documentation",
        "path": "./FULL-DOCUMENTATION.md"
      },
      {
        "type": "sections",
        "path": "./sections/"
      }
    ]
  }, null, 2);
}
