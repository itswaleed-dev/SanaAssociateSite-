'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle } from 'lucide-react';

export function ContactSection() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      {/* Background with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=800&fit=crop"
          alt="Architectural Villa"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/90 to-[#070707]/75" />
        <div className="absolute inset-0 bg-radial-[circle_at_center_rgba(82,214,208,0.1)_0%,transparent_70%]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs tracking-[0.3em] uppercase text-[#52d6d0] font-semibold mb-6">
            Begin Your Project
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Ready to Build Your <br />
            <span className="text-gradient">Architectural Masterpiece?</span>
          </h2>
          <p className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            From initial site consultation and floor plans to turnkey luxury interior finishing, partner with Pakistan&apos;s premier design studio to bring your dream residence to life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#52d6d0] text-black font-bold text-sm tracking-wider uppercase hover:bg-[#8aeae3] shadow-xl shadow-[#52d6d0]/25 transition-all duration-300 hover:scale-[1.02]"
            >
              Start Your Project <ArrowUpRight size={16} />
            </Link>
            <a
              href="https://wa.me/+923417945411?text=Hello%20Sana%20Associates!%20I%20would%20like%20to%20discuss%20an%20architectural%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/15 text-white font-semibold text-sm tracking-wider uppercase hover:bg-white/[0.08] transition-all duration-300"
            >
              <MessageCircle size={18} className="text-emerald-400" /> WhatsApp Studio
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
