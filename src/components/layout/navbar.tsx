'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Services', href: '/#services' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#070707]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl shadow-black/80 py-3'
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between ">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/LOGO1.png"
                alt="Sana Associates"
                className="h-10 sm:h-12 w-50 object-cover transition-transform duration-300 group-hover:scale-105 "
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/[0.08]">
              {links.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-300 rounded-full ${
                      isActive
                        ? 'text-[#52d6d0] font-semibold'
                        : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute bottom-1 left-4 right-4 h-[2px] bg-[#52d6d0] rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
             
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#52d6d0] text-black hover:bg-[#8aeae3] shadow-lg shadow-[#52d6d0]/20 hover:shadow-[#52d6d0]/40 transition-all duration-300 hover:scale-[1.02]"
              >
                Book Consultation
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link
                href="/contact"
                className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#52d6d0] text-black"
              >
                Inquire
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open mobile menu"
                className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-2xl lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={e => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-[#0a0a0a] border-l border-white/10 shadow-2xl p-7 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <Link href="/" onClick={() => setMobileOpen(false)}>
                    <img src="/LOGO1.png" alt="Sana Associates" className="h-9 w-auto" />
                  </Link>
                  <button
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close mobile menu"
                    className="p-2.5 text-white/60 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="flex flex-col gap-1.5">
                  {links.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-4 py-3 rounded-2xl text-base font-medium tracking-wide transition-all ${
                          pathname === link.href
                            ? 'bg-[#52d6d0]/10 text-[#52d6d0] font-semibold border border-[#52d6d0]/20'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#52d6d0] text-black font-bold text-sm tracking-wider uppercase hover:bg-[#8aeae3] transition-all"
                  >
                    Book Consultation <ArrowUpRight size={16} />
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white/70 text-xs font-semibold uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all"
                  >
                    Admin Portal
                  </Link>
                </div>
              </div>

              {/* Studio Info Footer in Drawer */}
              <div className="pt-8 border-t border-white/10 space-y-2.5 text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#52d6d0] shrink-0" />
                  <span>Johar Town, Lahore, Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-[#52d6d0] shrink-0" />
                  <span>+92 341 7945411</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-[#52d6d0] shrink-0" />
                  <span>waleedcoderz@gmail.com</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
