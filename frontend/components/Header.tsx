'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Menu, X, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { label: 'Product', href: '#solution' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Contact', href: '#contact' },
];

export function Header() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-border-subtle backdrop-blur-xl bg-obsidian/80'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl
            bg-gradient-cyan-violet shadow-neon-cyan
            transition-transform duration-300 group-hover:scale-105">
            <Shield className="h-4 w-4 text-obsidian-deep" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-sm tracking-wider text-text-primary">IMPACTLENS</span>
            <span className="text-[9px] font-bold text-cyan tracking-widest font-mono">AI PLATFORM</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-text-muted
                hover:text-text-primary hover:bg-white/[0.04] transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="btn-primary text-xs px-4 py-2">
              <Zap className="w-3.5 h-3.5" />
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex btn-ghost text-xs px-4 py-2"
              >
                Sign In
              </Link>
              <Link href="/login?mode=register" className="btn-primary text-xs px-4 py-2">
                Get Started
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-subtle bg-obsidian-dark/95 backdrop-blur-xl animate-fade-in-down">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-text-muted
                  hover:text-text-primary hover:bg-white/[0.04] transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border-subtle mt-2 flex flex-col gap-2">
              <Link href="/login" className="btn-ghost text-sm py-2.5">Sign In</Link>
              <Link href="/login?mode=register" className="btn-primary text-sm py-2.5">
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
