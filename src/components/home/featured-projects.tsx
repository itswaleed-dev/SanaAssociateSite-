'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Calendar, Layers } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';

const mockProjects = [
  {
    _id: 'p1',
    title: 'Modern Villa Design',
    category: 'Architecture',
    location: 'Lahore',
    year: 2026,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    description: 'Clean architectural lines with floor-to-ceiling glass and seamless indoor-outdoor living.',
  },
  {
    _id: 'p2',
    title: 'Luxury Living Room',
    category: 'Interior',
    location: 'Johar Town, Lahore',
    year: 2025,
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    description: 'Bespoke marble details, ambient linear lighting, and custom crafted Italian furnishings.',
  },
  {
    _id: 'p3',
    title: 'Contemporary Exterior',
    category: 'Exterior',
    location: 'DHA, Lahore',
    year: 2026,
    coverImage: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=600&fit=crop',
    description: 'Dramatic architectural facade featuring natural stone textures and recessed accent illumination.',
  },
  {
    _id: 'p4',
    title: 'Modern Kitchen Design',
    category: 'Interior',
    location: 'Gulberg, Lahore',
    year: 2025,
    coverImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop',
    description: 'Minimalist kitchen layout with integrated appliances and a quartz waterfall island.',
  },
  {
    _id: 'p5',
    title: 'Luxury Villa Exterior',
    category: 'Exterior',
    location: 'Bahria Town, Lahore',
    year: 2026,
    coverImage: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
    description: 'Grand classical entrance complemented by modern landscaped outdoor water terraces.',
  },
  {
    _id: 'p6',
    title: 'Master Bedroom Suite',
    category: 'Interior',
    location: 'Model Town, Lahore',
    year: 2025,
    coverImage: 'https://images.unsplash.com/photo-1600210491892-03dee9141e6b?w=800&h=600&fit=crop',
    description: 'Tranquil sanctuary with custom walnut paneling, plush textiles, and a walk-in wardrobe.',
  },
];

const catBadges: Record<string, { bg: string; text: string; border: string }> = {
  Architecture: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  Interior: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  Exterior: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

export function FeaturedProjects({ dbData }: { dbData: any[] | null }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const allProjects = dbData && dbData.length > 0 ? dbData : mockProjects;

  const filtered = activeCategory === 'All'
    ? allProjects
    : allProjects.filter((p: any) => p.category === activeCategory);

  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a] relative overflow-hidden" id="projects">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#52d6d0]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="Featured Architectural Works"
          subtitle="Portfolio Highlights"
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {['All', 'Architecture', 'Interior', 'Exterior'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#52d6d0] text-black shadow-lg shadow-[#52d6d0]/25'
                  : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.slice(0, 6).map((p: any, i: number) => {
              const badge = catBadges[p.category] || catBadges.Architecture;
              return (
                <motion.div
                  key={p._id || p.id || i}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Link
                    href="/projects"
                    className="group block rounded-3xl overflow-hidden glass-card border border-white/[0.08] hover:border-[#52d6d0]/30 transition-all duration-500"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-80" />

                      {/* Category Chip */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border backdrop-blur-md ${badge.bg} ${badge.text} ${badge.border}`}>
                          {p.category}
                        </span>
                      </div>

                      {/* Arrow Icon */}
                      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 group-hover:text-black group-hover:bg-[#52d6d0] transition-all duration-300">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="p-6">
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:text-[#52d6d0] transition-colors">
                        {p.title}
                      </h3>
                      {p.description && (
                        <p className="text-white/50 text-xs line-clamp-2 mb-4 font-light leading-relaxed">
                          {p.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-white/40 text-xs pt-3 border-t border-white/[0.06]">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#52d6d0]" /> {p.location || 'Lahore'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#52d6d0]" /> {p.year || 2026}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* View All CTA */}
        <div className="text-center mt-14">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/[0.04] hover:bg-[#52d6d0] text-white hover:text-black border border-white/10 hover:border-[#52d6d0] text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl"
          >
            View Complete Portfolio <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
