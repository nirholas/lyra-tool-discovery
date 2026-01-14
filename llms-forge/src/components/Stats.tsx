'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const STATS = [
  { label: 'Sites Processed', value: 124567, suffix: '+' },
  { label: 'Tokens Extracted', value: 8.4, suffix: 'B', isFloat: true },
  { label: 'MCP Servers Deployed', value: 12483, suffix: '' },
  { label: 'Models in Ensemble', value: 1600, suffix: '+' },
]

function AnimatedNumber({ value, suffix, isFloat }: { value: number; suffix: string; isFloat?: boolean }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span className="font-mono">
      {isFloat ? displayValue.toFixed(1) : Math.floor(displayValue).toLocaleString()}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-gray-800 p-8 bg-dark-800/50 backdrop-blur-xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyber-green via-cyber-blue to-cyber-purple bg-clip-text text-transparent mb-2">
                <AnimatedNumber 
                  value={stat.value} 
                  suffix={stat.suffix}
                  isFloat={stat.isFloat}
                />
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
