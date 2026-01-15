'use client'

import { motion } from 'framer-motion'
import { Globe, Download, Files } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: Globe,
      title: 'Paste URL',
      description: 'Enter any documentation site URL. We support any site that has an llms.txt or llms-full.txt file.',
    },
    {
      icon: Download,
      title: 'Extract',
      description: 'We automatically find and fetch the llms.txt file, then parse it into organized sections.',
    },
    {
      icon: Files,
      title: 'Download',
      description: 'Get individual markdown files for each section, plus a complete bundle with AGENT-GUIDE.md.',
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
          <Download className="w-4 h-4 text-cyber-blue" />
          <span className="text-sm font-medium text-cyber-blue">HOW IT WORKS</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Three Simple Steps
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Get documentation ready for AI agents in seconds
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="rounded-xl border border-gray-800 bg-dark-800/50 backdrop-blur-sm p-6 hover:border-gray-700 transition-all h-full text-center">
              <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-cyber-green/10 to-cyber-blue/10 border border-gray-800 flex items-center justify-center mb-4 group-hover:border-cyber-green/30 transition-colors">
                <step.icon className="w-7 h-7 text-cyber-green" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-sm font-mono text-gray-500">0{index + 1}</span>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
