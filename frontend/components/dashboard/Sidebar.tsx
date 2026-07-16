'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';
import { initials } from '@/utils/format';
import {
  Shield, Terminal,
  LayoutDashboard, Users, BrainCircuit, HeartHandshake,
  FileSpreadsheet, Building2, FolderGit2, UserCheck, Activity,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',      label: 'Overview',         icon: LayoutDashboard, roles: ['Super Admin', 'NGO Admin', 'Donor', 'Volunteer'] },
  { id: 'programs',      label: 'Programs',         icon: FolderGit2,      roles: ['Super Admin', 'NGO Admin', 'Donor', 'Volunteer'] },
  { id: 'beneficiaries', label: 'Beneficiaries',    icon: Users,           roles: ['Super Admin', 'NGO Admin', 'Donor', 'Volunteer'] },
  { id: 'volunteers',    label: 'Volunteers',        icon: UserCheck,       roles: ['Super Admin', 'NGO Admin'] },
  { id: 'activities',    label: 'Field Activities',  icon: Activity,        roles: ['Super Admin', 'NGO Admin', 'Volunteer'] },
  { id: 'ai',            label: 'AI Analytics',      icon: BrainCircuit,    roles: ['Super Admin', 'NGO Admin'] },
  { id: 'donations',     label: 'Donations',         icon: HeartHandshake,  roles: ['Super Admin', 'NGO Admin', 'Donor'] },
  { id: 'reports',       label: 'Reports',           icon: FileSpreadsheet, roles: ['Super Admin', 'NGO Admin', 'Donor', 'Volunteer'] },
  { id: 'organization',  label: 'Organization',      icon: Building2,       roles: ['Super Admin', 'NGO Admin'] },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardSidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user } = useAuth();
  const role = user?.role || 'Volunteer';
  const filtered = NAV_ITEMS.filter(item => item.roles.includes(role));

  return (
    <aside className="w-60 bg-obsidian-dark border-r border-border-subtle flex flex-col h-screen shrink-0 relative overflow-hidden">
      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-grid opacity-[0.3] pointer-events-none" />

      {/* Top glow */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-cyan/20 via-transparent to-violet/10 pointer-events-none" />

      {/* Brand */}
      <div className="relative z-10 h-14 flex items-center px-5 border-b border-border-subtle shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-cyan-violet shadow-neon-cyan transition-transform group-hover:scale-105">
            <Shield className="h-3.5 w-3.5 text-obsidian-deep" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-[11px] tracking-widest text-text-primary">IMPACTLENS</span>
            <span className="font-mono text-[8px] text-cyan tracking-widest flex items-center gap-1">
              <Terminal className="w-2 h-2" /> AI v2.0
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {filtered.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'group flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-[11px] font-semibold transition-all duration-200 text-left',
                active
                  ? 'bg-cyan-glow text-text-primary border border-cyan/15'
                  : 'text-text-muted hover:text-text-primary hover:bg-white/[0.03]'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={cn(
                  'w-3.5 h-3.5 shrink-0 transition-colors',
                  active ? 'text-cyan' : 'text-text-muted group-hover:text-text-primary'
                )} />
                <span className="uppercase tracking-wider">{item.label}</span>
              </div>
              {active && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan" />
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="relative z-10 px-3 py-4 border-t border-border-subtle space-y-3 shrink-0">
        {/* Status row */}
        <div className="px-3 py-2 rounded-lg bg-black/30 border border-border-subtle flex items-center justify-between text-[9px] font-mono text-text-muted">
          <span>NODE STATUS</span>
          <span className="flex items-center gap-1 text-mint font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-dot" />
            ONLINE
          </span>
        </div>

        {/* User row */}
        <div className="flex items-center gap-2.5 px-1">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-dim to-violet-dim border border-border-default flex items-center justify-center text-[10px] font-black text-text-primary shrink-0">
            {user?.name ? initials(user.name) : 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[11px] font-bold text-text-primary truncate">{user?.name || 'Authorized User'}</span>
            <span className="text-[9px] text-text-muted font-mono truncate">{user?.role || 'Volunteer'}</span>
          </div>
          <ChevronRight className="w-3 h-3 text-text-muted shrink-0 ml-auto" />
        </div>
      </div>
    </aside>
  );
}
