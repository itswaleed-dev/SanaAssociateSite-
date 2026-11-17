'use client';
import Link from 'next/link';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ variant = 'primary', size = 'md', href, className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 focus:outline-none';
  const variants: Record<string, string> = {
    primary: 'bg-[#52d6d0] text-black hover:bg-[#8aeae3] shadow-lg shadow-[#52d6d0]/20 hover:shadow-[#52d6d0]/40',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    outline: 'border border-[#52d6d0]/40 text-[#52d6d0] hover:bg-[#52d6d0]/10 hover:border-[#52d6d0]',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5',
  };
  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-xs rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-sm rounded-2xl',
  };
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}
