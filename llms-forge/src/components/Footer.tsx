'use client'

import { motion } from 'framer-motion'
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-dark-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-green via-cyber-blue to-cyber-purple flex items-center justify-center">
                <Zap className="w-6 h-6 text-dark-900" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyber-green via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                LLMs Forge
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md mb-4">
              The world's most advanced AI documentation extraction platform. 
              Transform any docs site into LLM-ready content with our quantum-enhanced neural pipelines.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-dark-700/50 flex items-center justify-center hover:bg-dark-600/50 transition-colors">
                <Github className="w-5 h-5 text-gray-400" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-dark-700/50 flex items-center justify-center hover:bg-dark-600/50 transition-colors">
                <Twitter className="w-5 h-5 text-gray-400" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-dark-700/50 flex items-center justify-center hover:bg-dark-600/50 transition-colors">
                <Linkedin className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-cyber-green transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-cyber-green transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-cyber-green transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-cyber-green transition-colors">MCP Integration</a></li>
              <li><a href="#" className="hover:text-cyber-green transition-colors">Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-cyber-green transition-colors">About</a></li>
              <li><a href="#" className="hover:text-cyber-green transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-cyber-green transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyber-green transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-cyber-green transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500">
            © 2026 LLMs Forge. All rights reserved. 
            <span className="ml-2 text-cyber-green/60">Powered by Quantum Neural Networks™</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
