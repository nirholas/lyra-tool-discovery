'use client'

import { motion } from 'framer-motion'
import { Bot, Layers, Sparkles, Zap } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Sparkles,
      title: 'Forge-1 Foundation Model',
      description: 'Our proprietary ensemble combines 1,600+ specialized models trained on technical documentation, API references, and developer content from across the web.',
    },
    {
      icon: Layers,
      title: 'Intelligent Content Extraction',
      description: 'Advanced parsing algorithms detect and extract documentation structure, code samples, and semantic relationships while preserving context and hierarchy.',
    },
    {
      icon: Bot,
      title: 'Agent-Native Optimization',
      description: 'Content is automatically formatted for AI agent consumption with proper chunking, metadata generation, and MCP tool definitions ready for deployment.',
    },
    {
      icon: Zap,
      title: 'Instant Deployment',
      description: 'Deploy as an MCP server, REST API, or download in multiple formats. Your documentation becomes a queryable knowledge base in seconds.',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 scroll-mt-24">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/20 mb-6"
        >
          <Layers className="w-4 h-4 text-cyber-blue" />
          <span className="text-sm font-medium text-cyber-blue">TECHNOLOGY</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          How It Works
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          State-of-the-art extraction pipeline powered by ensemble learning and optimized for AI agents
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="rounded-xl border border-gray-800 bg-dark-800/50 backdrop-blur-sm p-6 hover:border-gray-700 transition-all h-full">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-green/10 to-cyber-blue/10 border border-gray-800 flex items-center justify-center flex-shrink-0 group-hover:border-cyber-green/30 transition-colors">
                  <step.icon className="w-6 h-6 text-cyber-green" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-gray-500">0{index + 1}</span>
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Technical specs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <div className="rounded-xl border border-gray-800 bg-dark-800/50 backdrop-blur-sm p-8">
          <h3 className="text-lg font-semibold text-white mb-6">Model Architecture</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-gray-500 mb-1">Ensemble Size</div>
              <div className="text-white font-semibold">1,600+ models</div>
              <div className="text-xs text-gray-600 mt-1">Specialized extractors for different doc formats</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Training Data</div>
              <div className="text-white font-semibold">50M+ documentation pages</div>
              <div className="text-xs text-gray-600 mt-1">From GitHub, technical blogs, API docs</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Average Latency</div>
              <div className="text-white font-semibold">&lt; 3 seconds</div>
              <div className="text-xs text-gray-600 mt-1">End-to-end processing time</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
