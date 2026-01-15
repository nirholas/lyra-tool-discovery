'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import UrlInput from '@/components/UrlInput'
import ExtractionProcess from '@/components/ExtractionProcess'
import OutputSection from '@/components/OutputSection'
import Features from '@/components/Features'
import Stats from '@/components/Stats'
import Footer from '@/components/Footer'
import ParticleBackground from '@/components/ParticleBackground'
import type { ExtractionResult, ExtractionState } from '@/types'

export type { ExtractionResult, ExtractionState }

export default function Home() {
  const [state, setState] = useState<ExtractionState>('idle')
  const [result, setResult] = useState<ExtractionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExtract = async (url: string) => {
    setState('extracting')
    setError(null)
    
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      
      if (!response.ok) {
        throw new Error('Extraction failed')
      }
      
      const data = await response.json()
      setResult(data)
      setState('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setState('error')
    }
  }

  const handleReset = () => {
    setState('idle')
    setResult(null)
    setError(null)
  }

  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Hero />
        
        {state === 'idle' && (
          <>
            <motion.div 
              className="max-w-4xl mx-auto mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <UrlInput onSubmit={handleExtract} />
            </motion.div>
            
            <HowItWorks />
            <Stats />
            <Features />
          </>
        )}
        
        {state !== 'idle' && (
          <motion.div 
            className="max-w-4xl mx-auto mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {state === 'extracting' && (
                <ExtractionProcess key="extracting" />
              )}
              
              {state === 'complete' && result && (
                <OutputSection 
                  key="output" 
                  result={result} 
                  onReset={handleReset}
                />
              )}
              
              {state === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-xl border border-neutral-700 bg-neutral-900/80 backdrop-blur-xl p-8 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-neutral-300 text-xl mb-4">
                    <AlertTriangle className="w-6 h-6" />
                    Extraction Failed
                  </div>
                  <p className="text-neutral-400 mb-6">{error}</p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white rounded-lg font-semibold text-black hover:bg-neutral-200 transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </main>
  )
}
