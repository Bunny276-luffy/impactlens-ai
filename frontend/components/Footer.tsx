import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

const FOOTER_LINKS = {
  'Platform': ['Features', 'How it Works', 'Pricing', 'Changelog'],
  'Resources': ['Documentation', 'API Reference', 'Blog', 'Case Studies'],
  'Company': ['About', 'Careers', 'Contact', 'Privacy Policy'],
};

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-obsidian-dark">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-cyan-violet shadow-neon-cyan">
                <Shield className="h-4 w-4 text-obsidian-deep" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-sm tracking-wider text-text-primary">IMPACTLENS</span>
                <span className="text-[9px] font-bold text-cyan tracking-widest font-mono">AI PLATFORM</span>
              </div>
            </Link>

            <p className="text-xs text-text-muted leading-relaxed max-w-xs">
              Next-generation intelligence platform empowering NGOs to quantify impact, verify field activities, and build transparent relationships with donors.
            </p>

            <div className="flex items-center gap-3">
              {[
                { name: 'GitHub', href: '#' },
                { name: 'Twitter', href: '#' },
                { name: 'LinkedIn', href: '#' },
              ].map(({ name, href }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="h-8 rounded-lg bg-white/[0.04] border border-border-subtle
                    flex items-center justify-center text-text-muted hover:text-text-primary
                    hover:bg-white/[0.08] hover:border-border-strong transition-all text-xs font-bold px-3"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-text-muted hover:text-text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-text-disabled font-mono">
            © 2026 ImpactLens AI. Built for social impact.
          </p>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-dot" />
            <span className="text-[9px] font-mono text-text-muted">SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
