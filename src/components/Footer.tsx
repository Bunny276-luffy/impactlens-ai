'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Heart } from 'lucide-react';

export default function Footer() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="border-t border-white/8 bg-bg-darker py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue shadow-lg">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-base text-white">
              ImpactLens <span className="text-brand-purple">AI</span>
            </span>
          </Link>
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
            An advanced AI-powered NGO Intelligence Platform connecting NGO metrics with donor funding and volunteer monitoring.
          </p>
          <div className="flex items-center gap-3 mt-2 text-gray-400">
            <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.54v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.58 8.58 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 6.18 21 9.09 21c9.08 0 14-7.52 14-14v-.64c.97-.7 1.8-1.56 2.46-2.54z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Github">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Linkedin">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-4">Platform</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
            <li><a href="#features" className="hover:text-white transition-colors">AI Insights</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Child Monitoring</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Donor Transparency</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Volunteer Audit</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-4">Organization</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Our Partners</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Impact Reports</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy & Terms</a></li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">Support our Mission</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Help fund micro-nutrient meals and educational books directly to flagged children.
          </p>
          <Link 
            href="/login?role=donor" 
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-xs font-semibold transition-all"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
            Make a Microdonation
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-t border-white/5 mt-10 pt-6 text-[11px] text-gray-600">
        <p>© {mounted ? new Date().getFullYear() : '2026'} ImpactLens AI. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for NGO transparency.
        </p>
      </div>
    </footer>
  );
}
