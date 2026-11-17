'use client';
import { useState, useEffect } from 'react';
export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<'up'|'down'>('up');
  const [isAtTop, setIsAtTop] = useState(true);
  useEffect(() => {
    let lastY = window.scrollY;
    const h = () => { const y = window.scrollY; setIsAtTop(y < 50); setScrollDir(y > lastY ? 'down' : 'up'); lastY = y; };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return { scrollDir, isAtTop };
}
