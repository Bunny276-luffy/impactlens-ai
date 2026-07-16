'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { apiFetch } from '@/hooks/useApi';
import { cn } from '@/utils/cn';
import {
  Bell, LogOut, RefreshCw, Wifi, CheckCheck, X, AlertTriangle, Info, CheckCircle,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Critical' | 'Success';
  is_read: boolean;
  created_at: string;
}

const TYPE_ICON = {
  Info: <Info className="w-3.5 h-3.5 text-blue-400" />,
  Warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
  Critical: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />,
  Success: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
};

const TYPE_BORDER = {
  Info: 'border-blue-500/20',
  Warning: 'border-amber-500/20',
  Critical: 'border-red-500/20',
  Success: 'border-emerald-500/20',
};

interface NavbarProps {
  activeTab: string;
}

export function DashboardNavbar({ activeTab }: NavbarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifsLoading, setNotifsLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const TAB_LABELS: Record<string, string> = {
    overview: 'System Overview',
    programs: 'Program Management',
    beneficiaries: 'Beneficiary Registry',
    volunteers: 'Volunteer Roster',
    activities: 'Field Activities',
    ai: 'AI Analytics',
    donations: 'Donation Ledger',
    reports: 'Reports & Export',
    organization: 'Organization Settings',
  };

  const fetchNotifications = async () => {
    setNotifsLoading(true);
    try {
      const res = await apiFetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data?.data || []);
      }
    } catch { /* silent */ }
    finally { setNotifsLoading(false); }
  };

  useEffect(() => {
    if (notifOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [notifOpen]);

  const markAllRead = async () => {
    try {
      await apiFetch('/api/notifications', { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch { /* silent */ }
  };

  const handleLogout = async () => {
    await logout();
    toast('You have been signed out.', { type: 'info', title: 'Signed Out' });
    router.push('/login');
  };

  return (
    <header className="h-14 border-b border-border-subtle bg-obsidian-dark/90 backdrop-blur-lg
      flex items-center justify-between px-6 shrink-0 relative z-20">
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-text-primary">
          {TAB_LABELS[activeTab] || activeTab}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Sync status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border-subtle bg-white/[0.02] text-[9px] font-mono text-text-muted">
          <Wifi className="w-2.5 h-2.5 text-mint" />
          <span>NODE SYNCED</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className={cn(
              'relative h-8 w-8 rounded-lg flex items-center justify-center transition-all',
              notifOpen
                ? 'bg-white/[0.08] border border-border-strong text-text-primary'
                : 'bg-white/[0.03] border border-border-subtle text-text-muted hover:text-text-primary hover:bg-white/[0.06]'
            )}
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan text-obsidian-deep text-[8px] font-black flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-panel rounded-2xl overflow-hidden shadow-elevated animate-scale-in neon-top z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
                <span className="text-xs font-bold text-text-primary">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="flex items-center gap-1 text-[9px] text-cyan hover:text-cyan/80 font-bold">
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="text-text-muted hover:text-text-primary">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifsLoading ? (
                  <div className="p-6 flex justify-center">
                    <div className="h-5 w-5 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-text-muted">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={cn(
                        'flex items-start gap-3 px-4 py-3 border-b border-border-subtle last:border-0 transition-colors',
                        !n.is_read ? 'bg-white/[0.02]' : '',
                        'hover:bg-white/[0.03]'
                      )}
                    >
                      <div className={cn('shrink-0 mt-0.5 p-1.5 rounded-lg border', TYPE_BORDER[n.type], 'bg-white/[0.02]')}>
                        {TYPE_ICON[n.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-text-primary">{n.title}</p>
                        <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                      {!n.is_read && <span className="h-1.5 w-1.5 rounded-full bg-cyan mt-1.5 shrink-0" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="h-8 flex items-center gap-1.5 px-3 rounded-lg bg-white/[0.03] border border-border-subtle
            text-text-muted hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all text-[11px] font-semibold"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
