'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Globe, FileText, Check } from 'lucide-react'

interface UrlInputProps {
  onSubmit: (url: string) => void
}

export default function UrlInput({ onSubmit }: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url.trim())
    }
  }

  const exampleSites = [
    { name: 'Next.js Docs', url: 'https://nextjs.org/docs' },
    { name: 'Vercel Docs', url: 'https://vercel.com/docs' },
    { name: 'Stripe Docs', url: 'https://stripe.com/docs' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com/docs' },
  ]

  return (
    <motion.div
      id="extract"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative scroll-mt-24"
    >
      {/* Glow effect */}
      <div 
        className={`absolute -inset-4 bg-gradient-to-r from-cyber-green/10 via-cyber-blue/10 to-cyber-purple/10 rounded-3xl blur-2xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`}
      />
      
      <div className="relative rounded-2xl border border-gray-800 bg-dark-800/80 backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-green/20 to-cyber-blue/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-cyber-green" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Extract Documentation</h2>
              <p className="text-xs text-gray-500">Enter any documentation URL to get started</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileText className="w-3.5 h-3.5 text-cyber-green" />
            <span>Looks for llms.txt</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="https://docs.example.com"
                className="w-full pl-12 pr-32 py-4 bg-dark-900/80 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-cyber-green/50 focus:ring-1 focus:ring-cyber-green/20 transition-all"
              />
              <button
                type="submit"
                disabled={!url.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-white rounded-lg font-medium text-dark-900 flex items-center gap-2 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Extract
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Example sites */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Try:</span>
            {exampleSites.map((site) => (
              <button
                key={site.name}
                onClick={() => setUrl(site.url)}
                className="px-3 py-1.5 text-xs bg-dark-700/50 border border-gray-800 rounded-lg hover:border-gray-700 hover:bg-dark-600/50 transition-all text-gray-400 hover:text-white"
              >
                {site.name}
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-dark-900/50 border-t border-gray-800/50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyber-green" />
              Auto-detects llms.txt
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyber-green" />
              Organized markdown output
            </span>
            <span className="flex items-center gap-1.5 hidden sm:flex">
              <Check className="w-3.5 h-3.5 text-cyber-green" />
              Agent-ready format
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
