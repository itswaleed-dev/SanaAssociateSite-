'use client';
import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2 ">
            <Link href="/" className="inline-block ">
              <img src="/LOGO1.png" alt="Sana Associates" className="  h-20 w-auto mt-[-10px] object-cover" />
            </Link>
            <p className="text-white/40 leading-relaxed max-w-md mb-6 text-sm">
              Sana Associates is a premium architecture and design studio based in Lahore. We specialize in modern homes, luxury interiors, and stunning exterior designs.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs tracking-widest uppercase text-white/20">© 2026 Sana Associates</span>
            </div>
          </div>
          <div>
            <h4 className="text-white/80 font-semibold mb-5 tracking-wide text-sm uppercase">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><span className="text-white/40 hover:text-[#52d6d0] transition-colors cursor-pointer">Architectural Design</span></li>
              <li><span className="text-white/40 hover:text-[#52d6d0] transition-colors cursor-pointer">Interior Design</span></li>
              <li><span className="text-white/40 hover:text-[#52d6d0] transition-colors cursor-pointer">Exterior Design</span></li>
              <li><span className="text-white/40 hover:text-[#52d6d0] transition-colors cursor-pointer">3D Visualization</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white/80 font-semibold mb-5 tracking-wide text-sm uppercase">Contact</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3"><MapPin size={16} className="text-[#52d6d0] mt-0.5 shrink-0" /><span className="text-white/40">20 – A Ahbab Co-Operative Housing Society G – 3 Johar Town Lahore, Pakistan, 54000</span></div>
              <div className="flex items-center gap-3"><Mail size={16} className="text-[#52d6d0]" /><span className="text-white/40">info.sana.associates@gmail.com</span></div>
              <div className="flex items-center gap-3"><Phone size={16} className="text-[#52d6d0]" /><span className="text-white/40">+92 300 9470509</span></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
