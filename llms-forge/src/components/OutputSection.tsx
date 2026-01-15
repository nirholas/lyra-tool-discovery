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
      <div className="cyber-border rounded-2xl p-8 bg-dark-800/50 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyber-green to-cyber-blue flex items-center justify-center">
                <Check className="w-8 h-8 text-dark-900" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyber-green to-cyber-blue opacity-50 blur-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Extraction Complete</h2>
              <p className="text-gray-400 text-sm mt-1">
                Found {result.documents.length} documentation sections from{' '}
                <span className="text-cyber-green font-mono">{getHostname(result.url)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-dark-700/50 border border-gray-700 rounded-lg hover:border-cyber-green/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Extract Another
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-dark-900/50 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Files className="w-4 h-4 text-cyber-green" />
              <span className="text-xs text-gray-500">Total Documents</span>
            </div>
            <div className="text-2xl font-bold font-mono text-cyber-green">
              {totalFileCount}
            </div>
          </div>
          <div className="p-4 bg-dark-900/50 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-cyber-blue" />
              <span className="text-xs text-gray-500">Total Tokens</span>
            </div>
            <div className="text-2xl font-bold font-mono text-cyber-blue">
              {result.stats.totalTokens.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-dark-900/50 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-cyber-purple" />
              <span className="text-xs text-gray-500">Processing Time</span>
            </div>
            <div className="text-2xl font-bold font-mono text-cyber-purple">
              {result.stats.processingTime}ms
            </div>
          </div>
          <div className="p-4 bg-dark-900/50 rounded-xl border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 text-cyber-pink" />
              <span className="text-xs text-gray-500">Source</span>
            </div>
            <a
              href={result.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-cyber-pink hover:underline truncate block"
            >
              {result.sourceUrl.split('/').pop()}
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="cyber-border rounded-2xl overflow-hidden bg-dark-800/50 backdrop-blur-xl">
        <div className="flex border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-cyber-green border-b-2 border-cyber-green bg-cyber-green/5'
                  : 'text-gray-400 hover:text-white'
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
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-cyber-green/10 to-cyber-blue/10 border border-cyber-green/30 rounded-xl hover:border-cyber-green/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyber-green/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-cyber-green" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">{result.fullDocument.filename}</div>
                      <div className="text-xs text-gray-400">Complete documentation - {result.fullDocument.tokens.toLocaleString()} tokens</div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-cyber-green group-hover:scale-110 transition-transform" />
                </button>

                <button
                  onClick={() => handleDownloadFile(result.agentGuide)}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/30 rounded-xl hover:border-cyber-blue/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyber-blue/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-cyber-blue" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">{result.agentGuide.filename}</div>
                      <div className="text-xs text-gray-400">AI agent instructions - {result.agentGuide.tokens.toLocaleString()} tokens</div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-cyber-blue group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Document list */}
              {result.documents.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Individual Sections</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {result.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-dark-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-all group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-sm text-white truncate">{doc.filename}</div>
                            <div className="text-xs text-gray-500 truncate">{doc.title}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-gray-500 font-mono">
                            {doc.tokens.toLocaleString()} tokens
                          </span>
                          <button
                            onClick={() => handleDownloadFile(doc)}
                            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                            aria-label={`Download ${doc.filename}`}
                          >
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-cyber-green transition-colors" />
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
                  className="px-3 py-2 bg-dark-900 border border-gray-700 rounded-lg text-sm text-white focus:border-cyber-green focus:outline-none"
                >
                  {allDocuments.map((doc, index) => (
                    <option key={index} value={index}>
                      {doc.filename} ({doc.tokens.toLocaleString()} tokens)
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleCopy(selectedDocument.content, 'preview')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-dark-700/50 rounded-lg hover:bg-dark-600/50 transition-colors"
                >
                  {copied === 'preview' ? (
                    <Check className="w-3 h-3 text-cyber-green" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied === 'preview' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="terminal rounded-xl p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
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
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyber-green/20 to-cyber-blue/20 flex items-center justify-center mb-4">
                  <Archive className="w-8 h-8 text-cyber-green" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Download Everything</h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  Get all {totalFileCount} documents in a single ZIP file, including the complete documentation and AI agent guide.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleDownloadZip}
                  disabled={isDownloadingZip}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyber-green to-cyber-blue text-dark-900 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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

                <div className="flex items-center gap-6 text-sm text-gray-500">
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
              <div className="grid md:grid-cols-2 gap-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => handleDownloadFile(result.fullDocument)}
                  className="flex items-center justify-between p-3 bg-dark-900/50 border border-gray-800 rounded-lg hover:border-cyber-green/50 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyber-green" />
                    <span className="text-sm text-white">llms-full.md</span>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => handleDownloadFile(result.agentGuide)}
                  className="flex items-center justify-between p-3 bg-dark-900/50 border border-gray-800 rounded-lg hover:border-cyber-blue/50 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyber-blue" />
                    <span className="text-sm text-white">AGENT-GUIDE.md</span>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
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
        className="p-4 bg-cyber-blue/10 border border-cyber-blue/30 rounded-xl"
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-cyber-blue mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-cyber-blue">Pro tip</h4>
            <p className="text-sm text-gray-400 mt-1">
              You can usually access this content directly by adding{' '}
              <code className="px-1.5 py-0.5 bg-dark-700 rounded text-cyber-green font-mono text-xs">
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
