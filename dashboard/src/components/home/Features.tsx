'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FEATURES } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/Card';

const colorClasses = {
  violet: 'from-violet-500/20 to-violet-500/5 group-hover:from-violet-500/30',
  cyan: 'from-cyan-500/20 to-cyan-500/5 group-hover:from-cyan-500/30',
  pink: 'from-pink-500/20 to-pink-500/5 group-hover:from-pink-500/30',
  green: 'from-green-500/20 to-green-500/5 group-hover:from-green-500/30',
  orange: 'from-orange-500/20 to-orange-500/5 group-hover:from-orange-500/30',
  blue: 'from-blue-500/20 to-blue-500/5 group-hover:from-blue-500/30',
};

const iconColorClasses = {
  violet: 'bg-violet-500/20 text-violet-300',
  cyan: 'bg-cyan-500/20 text-cyan-300',
  pink: 'bg-pink-500/20 text-pink-300',
  green: 'bg-green-500/20 text-green-300',
  orange: 'bg-orange-500/20 text-orange-300',
  blue: 'bg-blue-500/20 text-blue-300',
};

function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-headline mb-4">
            Everything you need for{' '}
            <span className="gradient-text">MCP discovery</span>
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features to streamline your MCP tool discovery and plugin configuration workflow.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'group h-full bg-gradient-to-br transition-all duration-300',
                  colorClasses[feature.color]
                )}
              >
                <CardContent className="p-6">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                      'text-2xl transition-transform duration-300 group-hover:scale-110',
                      iconColorClasses[feature.color]
                    )}
                  >
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Features };
