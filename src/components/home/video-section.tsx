'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Film } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';

const mockVideos = [
  {
    _id: 'v1',
    title: 'Modern Villa Walkthrough & Spatial Flow',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'youtube',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop',
  },
  {
    _id: 'v2',
    title: 'Luxury Interior Finishes & Lighting Study',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'youtube',
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=450&fit=crop',
  },
  {
    _id: 'v3',
    title: 'Exterior Architecture & Landscaped Terraces',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'youtube',
    thumbnail: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=450&fit=crop',
  },
];

export function VideoSection({ dbData }: { dbData: any[] | null }) {
  const [activeVid, setActiveVid] = useState<any | null>(null);
  const videos = dbData && dbData.length > 0 ? dbData : mockVideos;

  return (
    <section className="py-24 md:py-32 bg-[#070707] relative overflow-hidden" id="videos">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading title="Cinematic Video Showcase" subtitle="Experience The Architecture" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((vid: any, i: number) => (
            <motion.div
              key={vid._id || vid.id || i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setActiveVid(vid)}
            >
              <div className="relative rounded-3xl overflow-hidden aspect-video glass-card border border-white/[0.08] group-hover:border-[#52d6d0]/40 transition-all duration-500 shadow-2xl">
                <img
                  src={vid.thumbnail || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=450&fit=crop'}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                {/* Type Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/70 backdrop-blur-md text-[#52d6d0] border border-white/10 flex items-center gap-1.5">
                    <Film size={11} /> {vid.type || 'Showcase'}
                  </span>
                </div>

                {/* Glowing Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#52d6d0] text-black flex items-center justify-center shadow-xl shadow-[#52d6d0]/30 group-hover:scale-110 group-hover:shadow-[#52d6d0]/50 transition-all duration-300">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="text-white font-bold text-sm sm:text-base line-clamp-1 group-hover:text-[#52d6d0] transition-colors">
                    {vid.title}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setActiveVid(null)}
          >
            <div
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVid(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Close video"
              >
                <X size={22} />
              </button>

              {activeVid.url?.includes('youtube') || activeVid.url?.includes('embed') ? (
                <iframe
                  src={
                    activeVid.url.includes('?')
                      ? `${activeVid.url}&autoplay=1`
                      : `${activeVid.url}?autoplay=1`
                  }
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  className="w-full h-full border-0"
                  title={activeVid.title}
                />
              ) : (
                <video
                  src={activeVid.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
