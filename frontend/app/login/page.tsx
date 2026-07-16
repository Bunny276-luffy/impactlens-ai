'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Shield, Eye, EyeOff, ChevronRight, Loader2, Terminal } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Constellation } from '@/components/ui/Constellation';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>(params.get('mode') === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('NGO Admin');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      toast('Please fill in all required fields', { type: 'warning' });
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast('Welcome back!', { type: 'success', title: 'Signed In' });
      } else {
        await register(email, password, name, role);
        toast('Account created successfully', { type: 'success', title: 'Welcome' });
      }
      const from = params.get('from') || '/dashboard';
      router.push(from);
    } catch (err: any) {
      toast(err.message || 'Authentication failed', { type: 'error', title: 'Error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
      {/* Background aurora blobs - kept for extra ambient glow */}
      <div className="aurora-blob-cyan w-[600px] h-[600px] -top-64 -left-64 opacity-20 mix-blend-screen" />
      <div className="aurora-blob-violet w-[500px] h-[500px] -bottom-48 -right-48 opacity-20 mix-blend-screen" />

      {/* Top left branding */}
      <Link href="/" className="absolute top-6 left-8 flex items-center gap-2.5 group">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-cyan-violet shadow-neon-cyan transition-transform group-hover:scale-110">
          <Shield className="h-3.5 w-3.5 text-obsidian-deep" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-black text-[10px] tracking-widest text-text-primary">IMPACTLENS</span>
          <span className="font-mono text-[8px] text-cyan tracking-widest">AI v2.0</span>
        </div>
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
        <div className="glass-panel rounded-3xl p-8 shadow-elevated neon-top">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-cyan-violet shadow-neon-cyan mb-4">
              <Shield className="h-7 w-7 text-obsidian-deep" />
            </div>
            <h1 className="text-xl font-extrabold text-text-primary">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-xs text-text-muted mt-1.5">
              {isLogin
                ? 'Sign in to your ImpactLens workspace'
                : 'Start measuring impact from day one'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-xl bg-obsidian p-1 border border-border-subtle mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-[11px] font-bold transition-all duration-200 capitalize',
                  mode === m
                    ? 'bg-gradient-cyan-violet text-obsidian-deep shadow-neon-cyan'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Full Name</label>
                <input
                  id="name"
                  className="glass-input text-sm"
                  placeholder="Priya Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Email Address</label>
              <input
                id="email"
                type="email"
                className="glass-input text-sm"
                placeholder="priya@impactlens.ai"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="glass-input text-sm pr-10"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Your Role</label>
                <select
                  id="role"
                  className="glass-input text-sm"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  {['NGO Admin', 'Volunteer', 'Donor', 'Super Admin'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}

            {isLogin && (
              <div className="text-right -mt-1">
                <button type="button" className="text-[10px] text-text-muted hover:text-cyan transition-colors font-semibold">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id={isLogin ? 'login-submit' : 'register-submit'}
              className="btn-primary w-full py-3 mt-2 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-text-muted mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(isLogin ? 'register' : 'login')} className="text-cyan font-bold hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Status indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-mono text-text-muted">
          <Terminal className="w-3 h-3" />
          <span>AUTH.NODE — SECURE TLS 1.3 — PKCE ENABLED</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
