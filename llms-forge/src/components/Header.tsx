'use client'

import { motion } from 'framer-motion'
import { Zap, Globe } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-dark-900/80 border-b border-gray-800/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyber-green to-cyber-blue flex items-center justify-center">
                <Zap className="w-5 h-5 text-dark-900" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">
                LLMs Forge
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-cyber-green/10 text-cyber-green rounded border border-cyber-green/20">
                BETA
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
              How it works
            </a>
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              API
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-700/50 border border-gray-800 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
              <span className="text-gray-400">All systems operational</span>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-dark-700/50 border border-gray-700 rounded-lg hover:bg-dark-600/50 transition-colors">
              Sign in
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-white text-dark-900 rounded-lg hover:bg-gray-100 transition-colors">
              Get started
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
