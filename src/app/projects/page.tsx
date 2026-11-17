'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Loader2, Search, X, Eye } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { ImageModal } from '@/components/ui/image-modal';

const mockProjects = [
  {
    _id: 'p1',
    title: 'Modern Villa Design',
    category: 'Architecture',
    location: 'Lahore',
    year: 2026,
    description: 'A stunning modern villa with clean lines, open spaces, and floor-to-ceiling glass windows. Designed for luxury living with a seamless indoor-outdoor connection.',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop',
    ],
  },
  {
    _id: 'p2',
    title: 'Luxury Living Room',
    category: 'Interior',
    location: 'Johar Town, Lahore',
    year: 2025,
    description: 'An exquisite luxury living room design with premium furniture, ambient lighting, and a sophisticated color palette.',
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600210491892-03dee9141e6b?w=1200&h=800&fit=crop',
    ],
  },
  {
    _id: 'p3',
    title: 'Contemporary Exterior',
    category: 'Exterior',
    location: 'DHA, Lahore',
    year: 2026,
    description: 'A bold contemporary exterior design featuring geometric forms, natural stone cladding, and landscaped gardens.',
    coverImage: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18f6b0055?w=1200&h=800&fit=crop',
    ],
  },
  {
    _id: 'p4',
    title: 'Modern Kitchen Design',
    category: 'Interior',
    location: 'Gulberg, Lahore',
    year: 2025,
    description: 'A modern kitchen design with premium finishes, smart storage solutions, and an elegant island centerpiece.',
    coverImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=800&fit=crop'],
  },
  {
    _id: 'p5',
    title: 'Luxury Villa Exterior',
    category: 'Exterior',
    location: 'Bahria Town, Lahore',
    year: 2026,
    description: 'An elegant luxury villa exterior with classical architectural elements, modern landscaping, and a grand entrance.',
    coverImage: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
    ],
  },
  {
    _id: 'p6',
    title: 'Master Bedroom Suite',
    category: 'Interior',
    location: 'Model Town, Lahore',
    year: 2025,
    description: 'A luxurious master bedroom suite with walk-in closet, spa-like bathroom, and panoramic windows.',
    coverImage: 'https://images.unsplash.com/photo-1600210491892-03dee9141e6b?w=1200&h=800&fit=crop',
    images: ['https://images.unsplash.com/photo-1600210491892-03dee9141e6b?w=1200&h=800&fit=crop'],
  },
];

const catColors: Record<string, { bg: string; text: string; border: string }> = {
  Architecture: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  Interior: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  Exterior: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(json => {
        setProjects(json.success && json.data.length > 0 ? json.data : mockProjects);
        setLoading(false);
      })
      .catch(() => {
        setProjects(mockProjects);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p: any) => {
      const matchCat = activeCat === 'all' || p.category === activeCat;
      const matchSearch =
        !searchQuery ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [projects, activeCat, searchQuery]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 flex items-center justify-center min-h-screen bg-[#070707]">
        <Loader2 className="animate-spin text-[#52d6d0]" size={44} />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-28 bg-[#070707] min-h-screen relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading title="Portfolio & Architectural Works" subtitle="Masterpieces" />

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['all', 'Architecture', 'Interior', 'Exterior'].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCat(cat);
                  setExpandedId(null);
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  activeCat === cat
                    ? 'bg-[#52d6d0] text-black shadow-lg shadow-[#52d6d0]/25 font-bold'
                    : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, city..."
              className="w-full pl-11 pr-10 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-[#52d6d0]/50 focus:ring-1 focus:ring-[#52d6d0]/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Projects List */}
        {filtered.length === 0 ? (
          <div className="p-16 text-center rounded-3xl glass-card border border-white/[0.08] max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">No projects matched your criteria</h3>
            <p className="text-sm text-white/40 mb-6">Try clearing your search query or choosing another category.</p>
            <button
              onClick={() => {
                setActiveCat('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full bg-[#52d6d0] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#8aeae3]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {filtered.map((p: any) => {
              const isExpanded = expandedId === (p._id || p.id);
              const images: string[] = Array.isArray(p.images)
                ? p.images
                : typeof p.images === 'string'
                ? JSON.parse(p.images || '[]')
                : [];
              const allImgs = images.length > 0 ? images : [p.coverImage];
              const badge = catColors[p.category] || catColors.Architecture;

              return (
                <motion.div
                  key={p._id || p.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="glass-card rounded-3xl border border-white/[0.08] hover:border-white/20 overflow-hidden shadow-2xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Cover Image */}
                    <div
                      className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[300px] overflow-hidden cursor-pointer group"
                      onClick={() => {
                        setLightboxImages(allImgs);
                        setLightboxIdx(0);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase border backdrop-blur-md ${badge.bg} ${badge.text} ${badge.border}`}>
                          {p.category}
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white/90 text-xs font-medium border border-white/10 group-hover:bg-[#52d6d0] group-hover:text-black transition-all">
                        <Eye size={13} /> View Gallery ({allImgs.length})
                      </div>
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-6 p-7 sm:p-10 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                          {p.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-5 text-xs text-white/40 mb-6">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-[#52d6d0]" /> {p.location || 'Lahore'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-[#52d6d0]" /> {p.year || 2026}
                          </span>
                        </div>

                        <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light mb-6">
                          {isExpanded
                            ? p.description
                            : (p.description || '').length > 150
                            ? `${(p.description || '').slice(0, 150)}...`
                            : p.description}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
                          {(p.description || '').length > 150 && (
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : p._id || p.id)}
                              className="inline-flex items-center gap-2 text-[#52d6d0] text-xs font-bold uppercase tracking-wider hover:gap-3 transition-all"
                            >
                              {isExpanded ? 'Collapse Overview' : 'Read Full Overview'} <ArrowRight size={14} />
                            </button>
                          )}

                          {allImgs.length > 1 && (
                            <button
                              onClick={() => {
                                setLightboxImages(allImgs);
                                setLightboxIdx(0);
                                setLightboxOpen(true);
                              }}
                              className="text-xs text-white/40 hover:text-white transition-colors ml-auto"
                            >
                              Open {allImgs.length} Photos
                            </button>
                          )}
                        </div>

                        {/* Thumbnail Strip */}
                        {allImgs.length > 1 && (
                          <div className="mt-5 grid grid-cols-4 gap-2">
                            {allImgs.slice(0, 4).map((imgUrl, i) => (
                              <div
                                key={i}
                                onClick={() => {
                                  setLightboxImages(allImgs);
                                  setLightboxIdx(i);
                                  setLightboxOpen(true);
                                }}
                                className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#52d6d0] transition-colors"
                              >
                                <img src={imgUrl} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <ImageModal
        images={lightboxImages}
        idx={lightboxIdx}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIdx(i => (i - 1 + lightboxImages.length) % lightboxImages.length)}
        onNext={() => setLightboxIdx(i => (i + 1) % lightboxImages.length)}
      />
    </div>
  );
}
