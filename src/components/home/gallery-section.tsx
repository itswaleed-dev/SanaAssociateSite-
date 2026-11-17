'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { ImageModal } from '@/components/ui/image-modal';

const mockItems = [
  { _id: 'g1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', title: 'Modern Villa Facade', category: 'Architecture' },
  { _id: 'g2', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop', title: 'Luxury Living & Lounge', category: 'Interior' },
  { _id: 'g3', url: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=600&fit=crop', title: 'Exterior Stone Cladding', category: 'Exterior' },
  { _id: 'g4', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', title: 'Grand Villa Entrance', category: 'Architecture' },
  { _id: 'g5', url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop', title: 'Modern Minimalist Kitchen', category: 'Interior' },
  { _id: 'g6', url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop', title: 'Estate Evening Illumination', category: 'Exterior' },
  { _id: 'g7', url: 'https://images.unsplash.com/photo-1600566753086-00f18f6b0055?w=800&h=600&fit=crop', title: 'Outdoor Living Deck', category: 'Exterior' },
  { _id: 'g8', url: 'https://images.unsplash.com/photo-1600210491892-03dee9141e6b?w=800&h=600&fit=crop', title: 'Master Bedroom Suite', category: 'Interior' },
];

export function GallerySection({ dbData }: { dbData: any[] | null }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [category, setCategory] = useState('All');

  const allItems = dbData && dbData.length > 0 ? dbData : mockItems;
  const filtered = category === 'All'
    ? allItems
    : allItems.filter((item: any) => item.category === category);

  const urls = filtered.map((i: any) => i.url);

  return (
    <section className="py-24 md:py-32 bg-[#0a0a0a] relative" id="gallery">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <SectionHeading title="Design & Aesthetics Gallery" subtitle="Visual Excellence" />

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {['All', 'Architecture', 'Interior', 'Exterior'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                category === cat
                  ? 'bg-[#52d6d0] text-black shadow-lg shadow-[#52d6d0]/25 font-bold'
                  : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Responsive Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          {filtered.map((item: any, i: number) => (
            <motion.div
              key={item._id || item.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => {
                setIdx(i);
                setOpen(true);
              }}
            >
              <div className="relative rounded-2xl overflow-hidden glass-card border border-white/[0.08] group-hover:border-[#52d6d0]/40 transition-all duration-500">
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <div className="self-end">
                    <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:text-[#52d6d0]">
                      <Maximize2 size={14} />
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#52d6d0] block mb-1">
                      {item.category}
                    </span>
                    <h4 className="text-white font-bold text-sm tracking-wide">
                      {item.title || 'Architectural View'}
                    </h4>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ImageModal
        images={urls}
        idx={idx}
        open={open}
        onClose={() => setOpen(false)}
        onPrev={() => setIdx(i => (i - 1 + urls.length) % urls.length)}
        onNext={() => setIdx(i => (i + 1) % urls.length)}
      />
    </section>
  );
}
