'use client'

import { motion } from 'framer-motion'
import { 
  Zap, Server, Code, Globe, Shield, Bot, 
  Layers, GitBranch, FileJson
} from 'lucide-react'

const FEATURES = [
  {
    icon: Layers,
    title: 'Ensemble Architecture',
    description: 'Combine 1,600+ specialized extraction models trained on different documentation formats and frameworks.',
    color: 'cyber-green',
  },
  {
    icon: Bot,
    title: 'Agent-Ready Output',
    description: 'Automatically formatted for MCP servers, function calling, and AI agent consumption with proper metadata.',
    color: 'cyber-blue',
  },
  {
    icon: Globe,
    title: 'REST API',
    description: 'Full REST API with OpenAPI spec. Rate limits up to 10,000 requests/hour on Pro plans.',
    color: 'cyber-purple',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC2 Type II certified with end-to-end encryption and optional customer-managed keys.',
    color: 'cyber-pink',
  },
  {
    icon: Zap,
    title: 'Sub-3s Processing',
    description: 'Average end-to-end extraction time under 3 seconds for standard documentation sites.',
    color: 'cyber-green',
  },
  {
    icon: Server,
    title: 'Hosted MCP Servers',
    description: 'Deploy instantly as a hosted MCP server. Your docs become queryable tools for AI agents.',
    color: 'cyber-blue',
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Automatic versioning of extracted docs with diff tracking and rollback capabilities.',
    color: 'cyber-purple',
  },
  {
    icon: FileJson,
    title: 'Multiple Formats',
    description: 'Export as JSON, JSONL, Markdown, or plain text with configurable chunking strategies.',
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
          <Shield className="w-4 h-4 text-cyber-purple" />
          <span className="text-sm font-medium text-cyber-purple">FEATURES</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Everything You Need
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          Production-ready documentation extraction infrastructure
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
