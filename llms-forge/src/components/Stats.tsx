'use client'

import { motion } from 'framer-motion'
import { Globe, Zap, Github, Heart } from 'lucide-react'

const HIGHLIGHTS = [
  { icon: Globe, label: 'Works with any llms.txt site' },
  { icon: Zap, label: '100% Free to use' },
  { icon: Github, label: 'Open Source' },
  { icon: Heart, label: 'No account required' },
]

export default function Stats() {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-neutral-800 p-8 bg-neutral-900/50 backdrop-blur-xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {HIGHLIGHTS.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 border border-neutral-800 flex items-center justify-center mb-3">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-sm text-neutral-400">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
