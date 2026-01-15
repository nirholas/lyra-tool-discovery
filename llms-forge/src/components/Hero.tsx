'use client'

import { motion } from 'framer-motion'
import { FileText, Bot, Download, ArrowRight, Github } from 'lucide-react'

export default function Hero() {
  return (
    <div className="text-center py-20">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
      >
        <Github className="w-4 h-4 text-white/60" />
        <span className="text-sm font-medium text-neutral-400">
          Free & <span className="text-white font-semibold">Open Source</span>
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
      >
        <span className="block text-white">Extract Documentation</span>
        <span className="block text-neutral-500">
          for AI Agents
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Instantly fetch and organize llms.txt files into downloadable markdown documents ready for Claude, ChatGPT, and other AI assistants.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        <a 
          href="#extract"
          className="px-8 py-4 bg-white rounded-xl font-semibold text-black flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-lg shadow-white/5"
        >
          Start Extracting
          <ArrowRight className="w-5 h-5" />
        </a>
        <a
          href="#how-it-works"
          className="px-8 py-4 bg-transparent border border-neutral-700 rounded-xl font-semibold text-white hover:border-neutral-500 hover:bg-white/5 transition-all"
        >
          How It Works
        </a>
      </motion.div>

      {/* Key features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-8 text-sm"
      >
        {[
          { icon: FileText, label: 'Fetches llms.txt', desc: 'Automatic discovery' },
          { icon: Bot, label: 'Agent-ready output', desc: 'Organized markdown files' },
          { icon: Download, label: 'One-click download', desc: 'Individual or ZIP bundle' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-neutral-800 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-white">{item.label}</div>
              <div className="text-neutral-500 text-xs">{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
