'use client'

import { motion } from 'framer-motion'
import { Zap, Github } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-dark-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-green via-cyber-blue to-cyber-purple flex items-center justify-center">
                <Zap className="w-6 h-6 text-dark-900" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyber-green via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                LLMs Forge
              </span>
            </Link>
            <p className="text-gray-500 text-sm text-center md:text-left max-w-md">
              Extract llms.txt files and convert them into organized markdown documents ready for AI agents.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a 
              href="https://x.com/nichxbt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyber-green transition-colors text-sm"
            >
              @nichxbt
            </a>
            <a 
              href="https://github.com/nirholas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-dark-700/50 flex items-center justify-center hover:bg-dark-600/50 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-gray-400 hover:text-white" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            Created by{' '}
            <a 
              href="https://x.com/nichxbt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyber-green hover:underline"
            >
              nich
            </a>
          </div>
          <div className="text-sm text-gray-500">
            Open source on{' '}
            <a 
              href="https://github.com/nirholas/lyra-tool-discovery" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyber-green hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
