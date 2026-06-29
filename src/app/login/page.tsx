'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useToast } from '@/contexts/ToastContext';
import { Shield, Lock, Mail, Users, Heart, UserSquare, ShieldAlert, ArrowRight } from 'lucide-react';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [role, setRole] = useState<'NGO' | 'DONOR' | 'VOLUNTEER' | 'ADMIN'>('NGO');
  const [email, setEmail] = useState('ngo@impactlens.ai');
  const [password, setPassword] = useState('Ngo@123');
  const [loading, setLoading] = useState(false);

  // Read role from query param if available
  useEffect(() => {
    const qRole = searchParams.get('role');
    if (qRole) {
      const upperRole = qRole.toUpperCase();
      if (['NGO', 'DONOR', 'VOLUNTEER', 'ADMIN'].includes(upperRole)) {
        handleRoleSelect(upperRole as any);
      }
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleRoleSelect = (selectedRole: 'NGO' | 'DONOR' | 'VOLUNTEER' | 'ADMIN') => {
    setRole(selectedRole);
    if (selectedRole === 'NGO') {
      setEmail('ngo@impactlens.ai');
      setPassword('Ngo@123');
    } else if (selectedRole === 'DONOR') {
      setEmail('donor@impactlens.ai');
      setPassword('Donor@123');
    } else if (selectedRole === 'VOLUNTEER') {
      setEmail('volunteer@impactlens.ai');
      setPassword('Volunteer@123');
    } else if (selectedRole === 'ADMIN') {
      setEmail('admin@impactlens.ai');
      setPassword('Admin@123');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please enter both email and password.', { type: 'warning', title: 'Inputs Required' });
      return;
    }

    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (res?.error) {
        toast('Invalid credentials. Please verify details and try again.', { 
          type: 'error', 
          title: 'Authentication Failed' 
        });
      } else {
        toast(`Successfully signed in as ${email}`, { 
          type: 'success', 
          title: 'Welcome Back!' 
        });
        router.refresh();
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast('A connection error occurred.', { type: 'error', title: 'Error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-dark text-white flex flex-col justify-center items-center px-4">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-purple/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-blue/10 blur-[150px] pointer-events-none" />

      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-2 group mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue shadow-lg">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-xl bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          ImpactLens <span className="text-brand-purple">AI</span>
        </span>
      </Link>

      {/* Login Box */}
      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-bg-darker/90 p-8 shadow-2xl relative glow-purple flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-white text-center">Sign In</h2>
          <p className="text-xs text-gray-500 text-center mt-1">Select your portal role for instant access.</p>
        </div>

        {/* Role Select Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'NGO', label: 'NGO', icon: Users, color: 'text-brand-purple' },
            { id: 'DONOR', label: 'Donor', icon: Heart, color: 'text-pink-400' },
            { id: 'VOLUNTEER', label: 'Volunteer', icon: UserSquare, color: 'text-brand-blue' },
            { id: 'ADMIN', label: 'Admin', icon: ShieldAlert, color: 'text-yellow-500' }
          ].map((r) => {
            const Icon = r.icon;
            const isSelected = role === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleSelect(r.id as any)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                  isSelected 
                    ? 'bg-white/5 border-brand-purple/50 scale-102 font-bold shadow-md' 
                    : 'border-white/5 bg-transparent opacity-60 hover:opacity-100 hover:bg-white/3'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${r.color}`} />
                <span className="text-[9px] uppercase tracking-wider">{r.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs glass-input"
                placeholder="ngo@impactlens.ai"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs glass-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Seed accounts disclaimer */}
          <div className="p-3 rounded-lg bg-white/3 border border-white/5 text-[10px] text-gray-500 leading-relaxed">
            💡 **Instant Preview Mode**: Choosing a role automatically pre-fills the credentials. Password is <code className="text-gray-300">password123</code>.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue font-bold text-xs text-white hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-1.5 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Enter {role} Portal
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors mt-8">
        ← Back to landing page
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-dark text-white flex justify-center items-center">
        <span className="h-6 w-6 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
