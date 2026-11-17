'use client';
import { motion } from 'framer-motion';

interface Props { title: string; subtitle?: string; light?: boolean; }

export function SectionHeading({ title, subtitle, light }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center mb-16 md:mb-20"
    >
      <span className="inline-block mb-4 text-xs tracking-[0.3em] uppercase text-[#52d6d0] font-semibold">
        {subtitle}
      </span>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
        {title}
      </h2>
      <div className="flex items-center justify-center gap-3">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#52d6d0]/50" />
        <div className="w-2 h-2 rounded-full bg-[#52d6d0]" />
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#52d6d0]/50" />
      </div>
    </motion.div>
  );
}
