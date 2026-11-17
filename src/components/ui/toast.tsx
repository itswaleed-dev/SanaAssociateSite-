'use client';
import { useState, createContext, useContext, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const ToastCtx = createContext<{ toast: (t: 'success' | 'error', m: string) => void }>({ toast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<{ id: string; type: 'success' | 'error'; msg: string }[]>([]);
  const toast = useCallback((type: 'success' | 'error', msg: string) => {
    const id = Date.now().toString();
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] space-y-3">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }} transition={{ duration: 0.3 }}
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#1a1a1a] border border-white/5 shadow-2xl backdrop-blur-xl min-w-[300px]">
              {t.type === 'success' ? <CheckCircle className="text-emerald-400" size={20} /> : <XCircle className="text-rose-400" size={20} />}
              <span className="text-sm font-medium text-white/80">{t.msg}</span>
              <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="ml-auto text-white/30 hover:text-white/60 transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
