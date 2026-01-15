'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download, Copy, Check, ExternalLink, RefreshCw,
  FileText, Archive, Eye, Files, Lightbulb, Clock, Hash
} from 'lucide-react'
import type { ExtractionResult, Document } from '@/types'
import { downloadFile, downloadZip, copyToClipboard, getHostname, estimateSize, calculateTotalSize } from '@/lib/download'

interface OutputSectionProps {
  result: ExtractionResult
  onReset: () => void
}

type TabType = 'documents' | 'preview' | 'download'

export default function OutputSection({ result, onReset }: OutputSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('documents')
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document>(result.fullDocument)
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const handleDownloadFile = (doc: Document) => {
    downloadFile(doc.content, doc.filename)
  }

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true)
    try {
      await downloadZip(
        result.documents,
        result.fullDocument,
        result.agentGuide,
        getHostname(result.url)
      )
    } catch (error) {
      console.error('Failed to download ZIP:', error)
    } finally {
      setIsDownloadingZip(false)
    }
  }

  const tabs = [
    { id: 'documents' as const, label: 'Documents', icon: Files },
    { id: 'preview' as const, label: 'Preview', icon: Eye },
    { id: 'download' as const, label: 'Download All', icon: Archive },
  ]

  // All documents including full and agent guide
  const allDocuments = [result.fullDocument, result.agentGuide, ...result.documents]
  const totalFileCount = allDocuments.length

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* Success header */}
      <div className="rounded-2xl border border-neutral-800 p-8 bg-neutral-900/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center">
                <Check className="w-8 h-8 text-black" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Extraction Complete</h2>
              <p className="text-neutral-400 text-sm mt-1">
                Found {result.documents.length} documentation sections from{' '}
                <span className="text-white font-mono">{getHostname(result.url)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 border border-neutral-700 rounded-lg hover:border-neutral-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Extract Another
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-black/50 rounded-xl border border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <Files className="w-4 h-4 text-white" />
              <span className="text-xs text-neutral-500">Total Documents</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {totalFileCount}
            </div>
          </div>
          <div className="p-4 bg-black/50 rounded-xl border border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-neutral-400" />
              <span className="text-xs text-neutral-500">Total Tokens</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {result.stats.totalTokens.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-black/50 rounded-xl border border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span className="text-xs text-neutral-500">Processing Time</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {result.stats.processingTime}ms
            </div>
          </div>
          <div className="p-4 bg-black/50 rounded-xl border border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 text-neutral-400" />
              <span className="text-xs text-neutral-500">Source</span>
            </div>
            <a
              href={result.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-white hover:underline truncate block"
            >
              {result.sourceUrl.split('/').pop()}
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900/50 backdrop-blur-xl">
        <div className="flex border-b border-neutral-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-white bg-white/5'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Featured documents */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleDownloadFile(result.fullDocument)}
                  className="flex items-center justify-between p-4 bg-white/5 border border-neutral-700 rounded-xl hover:border-neutral-500 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">{result.fullDocument.filename}</div>
                      <div className="text-xs text-neutral-400">Complete documentation - {result.fullDocument.tokens.toLocaleString()} tokens</div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>

                <button
                  onClick={() => handleDownloadFile(result.agentGuide)}
                  className="flex items-center justify-between p-4 bg-white/5 border border-neutral-700 rounded-xl hover:border-neutral-500 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">{result.agentGuide.filename}</div>
                      <div className="text-xs text-neutral-400">AI agent instructions - {result.agentGuide.tokens.toLocaleString()} tokens</div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Document list */}
              {result.documents.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-neutral-400 mb-3">Individual Sections</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {result.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-black/50 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-all group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-sm text-white truncate">{doc.filename}</div>
                            <div className="text-xs text-neutral-500 truncate">{doc.title}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-neutral-500 font-mono">
                            {doc.tokens.toLocaleString()} tokens
                          </span>
                          <button
                            onClick={() => handleDownloadFile(doc)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label={`Download ${doc.filename}`}
                          >
                            <Download className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <select
                  value={allDocuments.findIndex(d => d.filename === selectedDocument.filename)}
                  onChange={(e) => setSelectedDocument(allDocuments[parseInt(e.target.value)])}
                  className="px-3 py-2 bg-black border border-neutral-700 rounded-lg text-sm text-white focus:border-neutral-500 focus:outline-none"
                >
                  {allDocuments.map((doc, index) => (
                    <option key={index} value={index}>
                      {doc.filename} ({doc.tokens.toLocaleString()} tokens)
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleCopy(selectedDocument.content, 'preview')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {copied === 'preview' ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied === 'preview' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="terminal rounded-xl p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-neutral-300 whitespace-pre-wrap font-mono">
                  {selectedDocument.content}
                </pre>
              </div>
            </motion.div>
          )}

          {/* Download Tab */}
          {activeTab === 'download' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 border border-neutral-700 flex items-center justify-center mb-4">
                  <Archive className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Download Everything</h3>
                <p className="text-neutral-400 text-sm max-w-md mx-auto">
                  Get all {totalFileCount} documents in a single ZIP file, including the complete documentation and AI agent guide.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleDownloadZip}
                  disabled={isDownloadingZip}
                  className="flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloadingZip ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating ZIP...
                    </>
                  ) : (
                    <>
                      <Archive className="w-5 h-5" />
                      Download All as ZIP
                    </>
                  )}
                </button>

                <div className="flex items-center gap-6 text-sm text-neutral-500">
                  <span className="flex items-center gap-2">
                    <Files className="w-4 h-4" />
                    {totalFileCount} files
                  </span>
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {calculateTotalSize(result.documents, result.fullDocument, result.agentGuide)}
                  </span>
                </div>
              </div>

              {/* Quick download buttons */}
              <div className="grid md:grid-cols-2 gap-3 pt-4 border-t border-neutral-800">
                <button
                  onClick={() => handleDownloadFile(result.fullDocument)}
                  className="flex items-center justify-between p-3 bg-black/50 border border-neutral-800 rounded-lg hover:border-neutral-600 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-white" />
                    <span className="text-sm text-white">llms-full.md</span>
                  </div>
                  <Download className="w-4 h-4 text-neutral-400" />
                </button>
                <button
                  onClick={() => handleDownloadFile(result.agentGuide)}
                  className="flex items-center justify-between p-3 bg-black/50 border border-neutral-800 rounded-lg hover:border-neutral-600 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-white" />
                    <span className="text-sm text-white">AGENT-GUIDE.md</span>
                  </div>
                  <Download className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pro tip reveal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-white/5 border border-neutral-700 rounded-xl"
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-white">Pro tip</h4>
            <p className="text-sm text-neutral-400 mt-1">
              You can usually access this content directly by adding{' '}
              <code className="px-1.5 py-0.5 bg-neutral-800 rounded text-white font-mono text-xs">
                /llms-full.txt
              </code>{' '}
              to the end of most documentation URLs. This tool just makes it easier to organize and download.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
