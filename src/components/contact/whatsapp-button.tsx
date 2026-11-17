'use client';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WANUM = '+923296013379'; 
const WAMSG = encodeURIComponent('Hello Sana Associates! I would like to get more information about your architecture and design services.');

export function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${WANUM}?text=${WAMSG}`} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, duration: 0.4 }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[90] w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center transition-all duration-300 group"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={26} fill="currentColor" className="text-white" />
      <span className="absolute right-16 bg-[#25D366] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        Chat on WhatsApp
      </span>
    </motion.a>
    
  );
}
