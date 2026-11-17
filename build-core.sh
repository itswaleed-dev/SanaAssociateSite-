#!/bin/bash
set -e
mkdir -p src/{context,hooks,lib,components/{ui,layout,home,projects,gallery,design-ideas,house-plans,services,about,contact,search,favorites,theme,admin}}

# ============================================================
# CONTEXT — Theme & Favorites
# ============================================================
cat > src/context/theme-context.tsx << 'EOF'
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('archihome-theme') as Theme | null;
    if (stored) { setTheme(stored); return; }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('archihome-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, mounted]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>;

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
EOF
echo "theme-context done"

cat > src/context/favorites-context.tsx << 'EOF'
'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type FavType = 'project' | 'house-plan' | 'design-idea';

interface FavoritesContextType {
  favorites: Record<FavType, string[]>;
  toggleFavorite: (type: FavType, id: string) => void;
  isFavorite: (type: FavType, id: string) => boolean;
  clearAll: () => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: { project: [], 'house-plan': [], 'design-idea': [] },
  toggleFavorite: () => {},
  isFavorite: () => false,
  clearAll: () => {},
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Record<FavType, string[]>>({
    project: [], 'house-plan': [], 'design-idea': [],
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('archihome-favorites');
    if (stored) {
      try { setFavorites(JSON.parse(stored)); } catch {}
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('archihome-favorites', JSON.stringify(favorites));
  }, [favorites, mounted]);

  const toggleFavorite = useCallback((type: FavType, id: string) => {
    setFavorites(prev => {
      const list = prev[type];
      const exists = list.includes(id);
      return { ...prev, [type]: exists ? list.filter(x => x !== id) : [...list, id] };
    });
  }, []);

  const isFavorite = useCallback((type: FavType, id: string) => favorites[type].includes(id), [favorites]);

  const clearAll = () => setFavorites({ project: [], 'house-plan': [], 'design-idea': [] });

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearAll }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
EOF
echo "favorites-context done"

# ============================================================
# HOOKS
# ============================================================
cat > src/hooks/use-scroll-direction.ts << 'EOF'
'use client';
import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const handle = () => {
      const y = window.scrollY;
      setIsAtTop(y < 50);
      setScrollDir(y > lastY ? 'down' : 'up');
      lastY = y;
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return { scrollDir, isAtTop };
}
EOF

cat > src/hooks/use-count-up.ts << 'EOF'
'use client';
import { useEffect, useState, useRef } from 'react';

export function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [end, duration, start]);

  return count;
}
EOF

cat > src/hooks/use-intersection.ts << 'EOF'
'use client';
import { useState, useEffect, useRef } from 'react';

export function useIntersection(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(el); }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, isVisible };
}
EOF

cat > src/hooks/use-debounce.ts << 'EOF'
'use client';
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
EOF
echo "hooks done"

# ============================================================
# LIB
# ============================================================
cat > src/lib/utils.ts << 'EOF'
import { clsx, type ClassValue } from 'clsx';
const cn = (...inputs: ClassValue[]) => (inputs.filter(Boolean).join(' '));

export { cn };

export function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
EOF

# We don't have clsx installed, so use a simple cn:
cat > src/lib/cn.ts << 'EOF'
export function cn(...inputs: (string | false | null | undefined)[]): string {
  return inputs.filter(Boolean).join(' ');
}
EOF
echo "lib done"

