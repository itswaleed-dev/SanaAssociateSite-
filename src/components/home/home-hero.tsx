'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Compass, Award, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&fit=crop',
    title: 'Modern Luxury Villa',
    location: 'Lahore, Pakistan',
  },
  {
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&h=1080&fit=crop',
    title: 'Contemporary Penthouse Interior',
    location: 'Johar Town, Lahore',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1920&h=1080&fit=crop',
    title: 'Geometric Facade & Landscaping',
    location: 'DHA Phase 6, Lahore',
  },
];

const studioStats = [
  { value: '150+', label: 'Completed Projects', icon: Compass },
  { value: '15+', label: 'Years Experience', icon: Award },
  { value: '100%', label: 'Bespoke Craftsmanship', icon: ShieldCheck },
];

export function HomeHero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!paused) {
      timerRef.current = window.setInterval(() => {
        setCurrent(p => (p + 1) % heroImages.length);
      }, 7000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <section
      className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Homepage hero showcase"
    >
      {/* Background Carousel */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img
            src={heroImages[current].url}
            alt={heroImages[current].title}
            className="w-full h-full object-cover object-center"
          />
          {/* Architectural Dark Gradient Layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/75 to-[#070707]/50" />
          <div className="absolute inset-0 bg-radial-[circle_at_center_rgba(82,214,208,0.08)_0%,transparent_70%]" />
        </motion.div>
      </AnimatePresence>

      {/* Grid Overlay Texture */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Studio Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 text-white/90 text-xs tracking-[0.25em] uppercase font-medium mb-6 shadow-xl"
        >
          <Sparkles size={12} className="text-[#52d6d0]" />
          <span>Sana Associates • Luxury Architecture & Interior Studio</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.06] mb-6"
        >
          Designing <span className="text-gradient">Spaces.</span>
          <br />
          Crafting <span className="text-gradient">Legacies.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Transforming bold architectural visions into enduring residential and commercial landmarks with timeless elegance and precision engineering.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto"
        >
          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#52d6d0] text-black font-bold text-sm tracking-wider uppercase hover:bg-[#8aeae3] shadow-xl shadow-[#52d6d0]/25 hover:shadow-[#52d6d0]/40 transition-all duration-300 hover:scale-[1.02]"
          >
            Explore Projects <ArrowUpRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/15 text-white font-semibold text-sm tracking-wider uppercase hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300"
          >
            Book Free Consultation
          </Link>
        </motion.div>

        {/* Trust Metrics Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-3xl pt-8 border-t border-white/[0.08]"
        >
          {studioStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center justify-center sm:justify-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#52d6d0]/10 flex items-center justify-center text-[#52d6d0] shrink-0">
                  <Icon size={18} />
                </div>
                <div className="text-left">
                  <div className="text-xl font-extrabold text-white tracking-tight">{stat.value}</div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Carousel Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {heroImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}: ${img.title}`}
            className={`transition-all duration-500 rounded-full h-1.5 ${
              i === current
                ? 'w-10 bg-[#52d6d0]'
                : 'w-2.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Scroll Down Cue */}
      <div className="hidden md:flex absolute bottom-6 right-8 z-10 text-white/30 items-center gap-2 text-xs tracking-widest uppercase">
        <span>Scroll to discover</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown size={14} className="text-[#52d6d0]" />
        </motion.div>
      </div>
    </section>
  );
}

export default HomeHero;
