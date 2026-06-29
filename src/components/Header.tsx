'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Shield, LayoutDashboard, LogOut, LogIn, Heart } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-bg-darker/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue shadow-lg shadow-brand-purple/20">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-colors">
            ImpactLens <span className="text-brand-purple">AI</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-brand-purple/30 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-all shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-2 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Log In
              </Link>
              <Link 
                href="/login?role=donor" 
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 transition-all shadow-md shadow-brand-purple/15"
              >
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                Sponsor a Child
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
