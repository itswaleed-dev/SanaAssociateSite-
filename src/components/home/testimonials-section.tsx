'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';

const mockTestimonials = [
  {
    _id: 'tv1',
    name: 'Usman & Ayesha',
    role: '1 Kanal Luxury Villa Homeowners, DHA Lahore',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    rating: 5,
    review: 'Sana Associates turned our conceptual vision into our dream sanctuary. From floor-to-ceiling glass engineering to the bespoke walnut millwork in our living spaces, their architectural mastery and attention to detailing surpassed our every expectation.',
  },
  {
    _id: 'tv2',
    name: 'Kamran Malik',
    role: 'Premier Property Developer, Gulberg',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    rating: 5,
    review: 'Hands down the most visionary architectural firm in Lahore. Their modern facade compositions and structural spatial planning have elevated the entire value and aesthetic benchmark of our flagship housing developments.',
  },
  {
    _id: 'tv3',
    name: 'Fatima & Hassan',
    role: 'Contemporary Residence Owners, Johar Town',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    rating: 5,
    review: 'From initial 3D visualization to final interior handover, their architectural team demonstrated unmatched design acumen, transparency, and exquisite taste. Our home is a true living work of art.',
  },
];

export function TestimonialsSection({ dbData }: { dbData: any[] | null }) {
  const [current, setCurrent] = useState(0);
  const items = dbData && dbData.length > 0 ? dbData : mockTestimonials;

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length]);

  const t = items[current] || items[0];

  return (
    <section className="py-24 md:py-32 bg-[#070707] relative overflow-hidden" id="testimonials">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-[#52d6d0]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading title="Client Endorsements" subtitle="Stories of Excellence" />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-8 sm:p-12 md:p-16 border border-white/[0.08] text-center shadow-2xl relative"
            >
              {/* Giant ambient Quote icon */}
              <Quote
                className="text-[#52d6d0]/10 mx-auto mb-6 transition-transform duration-500"
                size={64}
              />

              {/* Review Text */}
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 leading-relaxed mb-8 font-light italic">
                &ldquo;{t.review}&rdquo;
              </p>

              {/* Star Ratings */}
              <div className="flex items-center justify-center gap-1.5 mb-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={18}
                    fill={i <= t.rating ? '#facc15' : 'none'}
                    className={i <= t.rating ? 'text-amber-400' : 'text-white/10'}
                  />
                ))}
              </div>

              {/* Client Profile */}
              <div className="flex flex-col items-center">
                <img
                  src={t.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop'}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-[#52d6d0]/40 shadow-lg"
                />
                <h4 className="font-bold text-white text-lg tracking-wide">{t.name}</h4>
                <p className="text-[#52d6d0] text-xs font-medium tracking-wider uppercase mt-0.5">
                  {t.role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrent(p => (p - 1 + items.length) % items.length)}
              aria-label="Previous testimonial"
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white border border-white/[0.06] transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {items.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to review ${i + 1}`}
                  className={`rounded-full transition-all duration-500 h-1.5 ${
                    i === current
                      ? 'w-8 bg-[#52d6d0]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrent(p => (p + 1) % items.length)}
              aria-label="Next testimonial"
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white border border-white/[0.06] transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
