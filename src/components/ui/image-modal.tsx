'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props { images: string[]; idx: number; open: boolean; onClose: () => void; onPrev: () => void; onNext: () => void; }

export function ImageModal({ images, idx, open, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    if (open) { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', h); }
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h); };
  }, [open, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl flex items-center justify-center"
          onClick={onClose}>
          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white z-10 p-2 rounded-xl hover:bg-white/5 transition-all"><X size={28} /></button>
          <div className="absolute top-6 left-6 text-white/30 text-sm font-mono z-10">{idx + 1} / {images.length}</div>
          {idx > 0 && (
            <button onClick={e => { e.stopPropagation(); onPrev(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 p-3 rounded-full hover:bg-white/5 transition-all">
              <ChevronLeft size={36} />
            </button>
          )}
          {idx < images.length - 1 && (
            <button onClick={e => { e.stopPropagation(); onNext(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white z-10 p-3 rounded-full hover:bg-white/5 transition-all">
              <ChevronRight size={36} />
            </button>
          )}
          <motion.img key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            src={images[idx]} alt="" className="max-w-[92vw] max-h-[88vh] object-contain rounded-2xl"
            onClick={e => e.stopPropagation()} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
