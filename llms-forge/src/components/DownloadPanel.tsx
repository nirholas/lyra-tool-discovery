'use client'

import { useState } from 'react'
import { Download, FileText, FolderArchive, Code, Settings, Check, Loader2 } from 'lucide-react'
import { createZipBundle, formatSize, getFileCount, calculateZipSize } from '@/lib/zip-builder'
import { slugify } from '@/lib/parser'
import type { GeneratedOutputs } from '@/lib/output-generator'

interface DownloadPanelProps {
  outputs: GeneratedOutputs
  siteName: string
}

export default function DownloadPanel({ outputs, siteName }: DownloadPanelProps) {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [downloadedFiles, setDownloadedFiles] = useState<Set<string>>(new Set())

  const downloadFile = (filename: string, content: string, mimeType: string = 'text/markdown') => {
    setDownloading(filename)
    
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setDownloadedFiles(prev => new Set(prev).add(filename))
    setDownloading(null)
  }

  const downloadZip = async () => {
    setDownloading('zip')
    
    try {
      const blob = await createZipBundle(outputs, siteName)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${slugify(siteName)}-docs.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setDownloadedFiles(prev => new Set(prev).add('zip'))
    } catch (error) {
      console.error('Failed to create ZIP:', error)
    }
    
    setDownloading(null)
  }

  const isDownloading = (key: string) => downloading === key
  const isDownloaded = (key: string) => downloadedFiles.has(key)

  const totalSize = calculateZipSize(outputs)
  const fileCount = getFileCount(outputs)

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Download className="w-5 h-5" />
        Download Files
      </h3>

      {/* Quick Download - ZIP */}
      <button
        onClick={downloadZip}
        disabled={isDownloading('zip')}
        className="w-full mb-4 flex items-center justify-between p-4 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          {isDownloading('zip') ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isDownloaded('zip') ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <FolderArchive className="w-5 h-5" />
          )}
          <div className="text-left">
            <div className="font-semibold">
              {isDownloading('zip') ? 'Creating ZIP...' : 'Download All (ZIP)'}
            </div>
            <div className="text-sm opacity-70">{fileCount} files included</div>
          </div>
        </div>
        <span className="text-sm opacity-70">{formatSize(totalSize)}</span>
      </button>

      {/* Individual Files */}
      <div className="space-y-2">
        <p className="text-sm text-neutral-400 mb-2">Or download individually:</p>

        {/* Full Documentation */}
        <DownloadButton
          onClick={() => downloadFile(outputs.fullDocument.filename, outputs.fullDocument.content)}
          icon={<FileText className="w-4 h-4 text-neutral-400" />}
          filename={outputs.fullDocument.filename}
          size={outputs.fullDocument.size}
          isDownloading={isDownloading(outputs.fullDocument.filename)}
          isDownloaded={isDownloaded(outputs.fullDocument.filename)}
        />

        {/* Agent Prompt */}
        <DownloadButton
          onClick={() => downloadFile(outputs.agentPrompt.filename, outputs.agentPrompt.content)}
          icon={<Code className="w-4 h-4 text-neutral-400" />}
          filename={outputs.agentPrompt.filename}
          size={outputs.agentPrompt.size}
          isDownloading={isDownloading(outputs.agentPrompt.filename)}
          isDownloaded={isDownloaded(outputs.agentPrompt.filename)}
        />

        {/* MCP Config */}
        <DownloadButton
          onClick={() =>
            downloadFile(outputs.mcpConfig.filename, outputs.mcpConfig.content, 'application/json')
          }
          icon={<Settings className="w-4 h-4 text-neutral-400" />}
          filename={outputs.mcpConfig.filename}
          size={outputs.mcpConfig.size}
          isDownloading={isDownloading(outputs.mcpConfig.filename)}
          isDownloaded={isDownloaded(outputs.mcpConfig.filename)}
        />

        {/* README */}
        <DownloadButton
          onClick={() => downloadFile(outputs.readme.filename, outputs.readme.content)}
          icon={<FileText className="w-4 h-4 text-neutral-400" />}
          filename={outputs.readme.filename}
          size={outputs.readme.size}
          isDownloading={isDownloading(outputs.readme.filename)}
          isDownloaded={isDownloaded(outputs.readme.filename)}
        />

        {/* Sections Count */}
        <div className="p-3 rounded-lg border border-neutral-800 text-neutral-400 text-sm flex items-center justify-between">
          <span>+ {outputs.sections.length} section files</span>
          <span className="text-neutral-500">(included in ZIP)</span>
        </div>
      </div>
    </div>
  )
}

interface DownloadButtonProps {
  onClick: () => void
  icon: React.ReactNode
  filename: string
  size: number
  isDownloading: boolean
  isDownloaded: boolean
}

function DownloadButton({
  onClick,
  icon,
  filename,
  size,
  isDownloading,
  isDownloaded,
}: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDownloading}
      className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-800 hover:border-neutral-600 transition-colors disabled:opacity-50"
    >
      <div className="flex items-center gap-3">
        {isDownloading ? (
          <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
        ) : isDownloaded ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          icon
        )}
        <span className="text-white">{filename}</span>
      </div>
      <span className="text-sm text-neutral-500">{formatSize(size)}</span>
    </button>
  )
}
