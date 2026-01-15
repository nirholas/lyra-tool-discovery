'use client'

import { motion } from 'framer-motion'
import { 
  Search, Scissors, Bot, Archive, FileText, Download
} from 'lucide-react'

const FEATURES = [
  {
    icon: Search,
    title: 'Smart Discovery',
    description: 'Automatically finds llms.txt or llms-full.txt on any documentation site.',
    color: 'cyber-green',
  },
  {
    icon: Scissors,
    title: 'Organized Sections',
    description: 'Splits documentation into individual markdown files by section headers.',
    color: 'cyber-blue',
  },
  {
    icon: Bot,
    title: 'Agent-Ready Output',
    description: 'Includes AGENT-GUIDE.md with instructions for AI assistants like Claude and ChatGPT.',
    color: 'cyber-purple',
  },
  {
    icon: Archive,
    title: 'One-Click Download',
    description: 'Download individual files or everything bundled as a convenient ZIP archive.',
    color: 'cyber-pink',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 scroll-mt-24">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyber-purple/10 to-cyber-pink/10 border border-cyber-purple/20 mb-6"
        >
          <FileText className="w-4 h-4 text-cyber-purple" />
          <span className="text-sm font-medium text-cyber-purple">FEATURES</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Simple & Effective
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Everything you need to get documentation ready for AI agents
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group rounded-xl border border-gray-800 p-6 bg-dark-800/50 backdrop-blur-sm hover:border-gray-700 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-green/10 to-cyber-blue/10 border border-gray-800 flex items-center justify-center mb-4 group-hover:border-cyber-green/30 transition-colors">
              <feature.icon className="w-6 h-6 text-cyber-green" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
