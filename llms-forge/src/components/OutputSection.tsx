'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, Copy, Check, ExternalLink, Server, 
  Code, Database, Zap, Globe, FileJson, RefreshCw
} from 'lucide-react'
import type { ExtractionResult } from '@/app/page'

interface OutputSectionProps {
  result: ExtractionResult
  onReset: () => void
}

type TabType = 'preview' | 'mcp' | 'api' | 'download'

export default function OutputSection({ result, onReset }: OutputSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('preview')
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const tabs = [
    { id: 'preview' as const, label: 'Preview', icon: FileJson },
    { id: 'mcp' as const, label: 'MCP Server', icon: Server },
    { id: 'api' as const, label: 'API Endpoint', icon: Globe },
    { id: 'download' as const, label: 'Download', icon: Download },
  ]

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
              <h2 className="text-2xl font-bold text-white">Extraction Complete!</h2>
              <p className="text-cyber-green font-mono text-sm">
                Documentation successfully processed
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
          {[
            { label: 'Total Tokens', value: result.stats.tokens.toLocaleString(), icon: Database, color: 'cyber-green' },
            { label: 'Content Chunks', value: result.stats.chunks.toLocaleString(), icon: Code, color: 'cyber-blue' },
            { label: 'Processing Time', value: `${result.stats.processingTime}ms`, icon: Zap, color: 'cyber-purple' },
            { label: 'Compression', value: `${result.stats.compressionRatio}x`, icon: FileJson, color: 'cyber-pink' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 bg-dark-900/50 rounded-xl border border-gray-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 text-${stat.color}`} />
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className={`text-2xl font-bold font-mono text-${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
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
          {activeTab === 'preview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Content Preview (first 500 chars)</span>
                <button
                  onClick={() => handleCopy(result.content, 'content')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-dark-700/50 rounded-lg hover:bg-dark-600/50 transition-colors"
                >
                  {copied === 'content' ? (
                    <Check className="w-3 h-3 text-cyber-green" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied === 'content' ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <div className="terminal rounded-xl p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {result.content.slice(0, 500)}...
                </pre>
              </div>
            </motion.div>
          )}

          {activeTab === 'mcp' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">MCP Server Configuration</h3>
                  <p className="text-sm text-gray-400">Add this to your claude_desktop_config.json</p>
                </div>
                <button
                  onClick={() => handleCopy(result.mcpConfig, 'mcp')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-cyber-green/20 text-cyber-green rounded-lg hover:bg-cyber-green/30 transition-colors"
                >
                  {copied === 'mcp' ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied === 'mcp' ? 'Copied!' : 'Copy Config'}
                </button>
              </div>
              <div className="terminal rounded-xl p-4">
                <pre className="text-sm text-cyber-green">
                  {result.mcpConfig}
                </pre>
              </div>
              <div className="p-4 bg-cyber-blue/10 border border-cyber-blue/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Server className="w-5 h-5 text-cyber-blue mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-cyber-blue">Hosted MCP Server</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Your MCP server is hosted at our global edge network and will be available for 30 days.
                      Upgrade to Pro for permanent hosting.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">REST API Endpoint</h3>
                  <p className="text-sm text-gray-400">Access your extracted documentation via API</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-4 bg-dark-900/50 rounded-xl">
                  <span className="px-2 py-1 text-xs font-bold bg-cyber-green text-dark-900 rounded">GET</span>
                  <code className="text-sm text-cyber-green font-mono flex-1">{result.apiEndpoint}</code>
                  <button
                    onClick={() => handleCopy(result.apiEndpoint, 'api')}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    {copied === 'api' ? (
                      <Check className="w-4 h-4 text-cyber-green" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                
                <div className="terminal rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-2"># Example usage with curl</div>
                  <pre className="text-sm text-gray-300">
{`curl -X GET "${result.apiEndpoint}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-4 bg-dark-900/50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Rate Limit</div>
                    <div className="text-lg font-mono text-cyber-green">1000/hr</div>
                  </div>
                  <div className="p-4 bg-dark-900/50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Response Time</div>
                    <div className="text-lg font-mono text-cyber-blue">&lt;50ms</div>
                  </div>
                  <div className="p-4 bg-dark-900/50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Uptime SLA</div>
                    <div className="text-lg font-mono text-cyber-purple">99.9%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'download' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { format: 'TXT', desc: 'Plain text format', size: `${(result.stats.tokens * 4 / 1024).toFixed(1)} KB`, icon: FileJson },
                  { format: 'JSON', desc: 'Structured JSON with metadata', size: `${(result.stats.tokens * 5 / 1024).toFixed(1)} KB`, icon: Code },
                  { format: 'MD', desc: 'Markdown formatted', size: `${(result.stats.tokens * 4.5 / 1024).toFixed(1)} KB`, icon: FileJson },
                  { format: 'JSONL', desc: 'JSON Lines for streaming', size: `${(result.stats.tokens * 4.8 / 1024).toFixed(1)} KB`, icon: Database },
                ].map((item) => (
                  <button
                    key={item.format}
                    className="flex items-center justify-between p-4 bg-dark-900/50 border border-gray-800 rounded-xl hover:border-cyber-green/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-green/20 to-cyber-blue/20 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-cyber-green" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white">{item.format}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">{item.size}</span>
                      <Download className="w-5 h-5 text-gray-400 group-hover:text-cyber-green transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
