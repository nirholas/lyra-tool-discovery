'use client'

import { motion } from 'framer-motion'
import { Zap, Github } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-neutral-800"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
            </div>
            <span className="text-lg font-bold text-white">
              llm.energy
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#how-it-works" className="text-neutral-400 hover:text-white transition-colors">
              How it works
            </a>
            <a href="#features" className="text-neutral-400 hover:text-white transition-colors">
              Features
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/nirholas/lyra-tool-discovery"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white bg-transparent border border-neutral-700 rounded-lg hover:border-neutral-600 hover:bg-white/5 transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="#extract"
              className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Get started
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
