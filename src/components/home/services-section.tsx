'use client';
import { motion } from 'framer-motion';
import { Building2, Sofa, Home, Cuboid, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SectionHeading } from '@/components/ui/section-heading';

const services = [
  {
    title: 'Architectural Design',
    icon: Building2,
    desc: 'Comprehensive architectural solutions from master planning and structural design to detailed construction documentation for luxury residences and commercial projects.',
    deliverables: ['Custom Villa Concepts', 'Structural Drawings', 'Approvals & Municipal Submissions', 'Site Supervision'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop',
  },
  {
    title: 'Luxury Interior Design',
    icon: Sofa,
    desc: 'Bespoke interior spaces curated with premium marble, exotic woodwork, mood lighting, and ergonomic furniture tailored to your refined lifestyle.',
    deliverables: ['Space Planning & Layouts', 'Custom Millwork & Cabinetry', 'Luxury Materials & Finishes', 'Curated Art & Lighting'],
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=500&fit=crop',
  },
  {
    title: 'Exterior & Facade Architecture',
    icon: Home,
    desc: 'Breathtaking modern facades blending geometric symmetry, architectural lighting, natural stone cladding, and landscaped outdoor terraces.',
    deliverables: ['Elevation Concept Renders', 'Stone & Wood Cladding Details', 'Landscape & Water Features', 'Outdoor Living Lounges'],
    image: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=500&fit=crop',
  },
  {
    title: '3D Photorealistic Visualization',
    icon: Cuboid,
    desc: 'Ultra-high-definition 3D renderings and immersive walkthrough animations enabling you to experience every texture, shadow, and reflection before groundbreaking.',
    deliverables: ['4K Photorealistic Stills', 'Cinematic Video Walkthroughs', 'Day / Night Lighting Studies', 'VR Virtual Tours'],
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=500&fit=crop',
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 md:py-32 bg-[#070707] relative overflow-hidden" id="services">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-[#52d6d0]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="Architectural & Design Services"
          subtitle="Our Expertise"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative rounded-3xl overflow-hidden glass-card border border-white/[0.08] hover:border-[#52d6d0]/30 flex flex-col justify-between"
              >
                {/* Image Showcase */}
                <div className="h-56 sm:h-64 overflow-hidden relative">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />

                  {/* Floating Icon */}
                  <div className="absolute top-5 left-5 w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-[#52d6d0] group-hover:scale-110 group-hover:bg-[#52d6d0] group-hover:text-black transition-all duration-300">
                    <Icon size={22} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#52d6d0] transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-6 font-light">
                      {s.desc}
                    </p>

                    {/* Key Deliverables Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                      {s.deliverables.map(deliv => (
                        <div key={deliv} className="flex items-center gap-2 text-xs text-white/70">
                          <CheckCircle2 size={13} className="text-[#52d6d0] shrink-0" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#52d6d0] hover:text-[#9cefe8] transition-colors pt-4 border-t border-white/[0.06] group/btn"
                  >
                    Consult on this Service
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
