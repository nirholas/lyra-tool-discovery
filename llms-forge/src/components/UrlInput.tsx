'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowRight, AlertCircle } from 'lucide-react'

interface UrlInputProps {
  onSubmit: (url: string) => void
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string.startsWith('http') ? string : `https://${string}`)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function UrlInput({ onSubmit }: UrlInputProps) {
  const [url, setUrl] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedUrl = url.trim()
    
    if (!trimmedUrl) {
      setError('Please enter a URL')
      return
    }
    
    if (!isValidUrl(trimmedUrl)) {
      setError('Please enter a valid URL')
      return
    }
    
    setError(null)
    onSubmit(trimmedUrl)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    if (error) setError(null)
  }

  return (
    <div className="relative">
      {/* Glow effect */}
      <div 
        className={`absolute -inset-2 bg-white/10 rounded-2xl blur-xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`}
      />
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="w-5 h-5 text-neutral-500" />
          </div>
          <input
            type="text"
            value={url}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter any website URL"
            className={`w-full pl-12 pr-32 py-4 bg-black border rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 transition-all text-lg ${
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-neutral-700 focus:border-neutral-500 focus:ring-white/10'
            }`}
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-white rounded-lg font-semibold text-black flex items-center gap-2 hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Extract
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="absolute -bottom-6 left-0 flex items-center gap-1.5 text-red-400 text-sm">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  )
}
