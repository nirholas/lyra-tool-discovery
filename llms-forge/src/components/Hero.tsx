'use client'

import { motion } from 'framer-motion'
import { Sparkles, Bot, Layers, ArrowRight, Cpu } from 'lucide-react'

export default function Hero() {
  return (
    <div className="text-center py-20">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyber-green/10 to-cyber-blue/10 border border-cyber-green/20 mb-8"
      >
        <Sparkles className="w-4 h-4 text-cyber-green" />
        <span className="text-sm font-medium text-gray-300">
          Introducing <span className="text-cyber-green font-semibold">Forge-1</span> — our foundation model for documentation
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
      >
        <span className="block text-white">Documentation Intelligence</span>
        <span className="block bg-gradient-to-r from-cyber-green via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
          for the AI Era
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Transform any documentation into AI-ready knowledge bases. 
        Powered by <span className="text-white font-medium">Forge-1</span>, our ensemble model combining 1,600+ specialized extractors trained on technical documentation.
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
          className="px-8 py-4 bg-white rounded-xl font-semibold text-dark-900 flex items-center gap-2 hover:bg-gray-100 transition-all shadow-lg shadow-white/10"
        >
          Start Extracting
          <ArrowRight className="w-5 h-5" />
        </a>
        <a
          href="#how-it-works"
          className="px-8 py-4 bg-dark-700/50 border border-gray-700 rounded-xl font-semibold text-white hover:border-gray-600 hover:bg-dark-600/50 transition-all"
        >
          How It Works
        </a>
      </motion.div>

      {/* Key stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-8 text-sm"
      >
        {[
          { icon: Layers, label: '1,600+ model ensemble', desc: 'Specialized extractors' },
          { icon: Bot, label: 'Agent-native output', desc: 'MCP & function calling ready' },
          { icon: Cpu, label: '< 3s average', desc: 'End-to-end processing' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-lg bg-dark-700/50 border border-gray-800 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-cyber-green" />
            </div>
            <div>
              <div className="font-medium text-white">{item.label}</div>
              <div className="text-gray-500 text-xs">{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
