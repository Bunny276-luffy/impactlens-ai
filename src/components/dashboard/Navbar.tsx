'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Bell, User, LogOut, Check } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { formatTime } from '@/lib/utils';

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  const fetchNotifications = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch(`/api/notifications?userId=${(session.user as any).id || ''}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll notifications every 10 seconds for real-time responsiveness
    const timer = setInterval(fetchNotifications, 10000);
    return () => clearInterval(timer);
  }, [session]);

  const markRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: 'PUT' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ' } : n));
        toast('Notification marked as read.', { type: 'success', duration: 2000 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;

  return (
    <header className="h-16 border-b border-white/8 bg-bg-darker/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-sm font-semibold text-gray-200">
          Welcome back, <span className="text-white">{session?.user?.name || 'User'}</span>
        </h1>
        <p className="text-[10px] text-brand-purple font-medium tracking-wide uppercase">
          {(session?.user as any)?.role || 'NGO'} PORTAL
        </p>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setOpenDropdown(!openDropdown)}
            className="p-2 rounded-lg bg-white/3 border border-white/5 hover:bg-white/5 hover:border-white/10 text-gray-300 hover:text-white transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {openDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/8 bg-bg-panel/95 shadow-2xl p-4 flex flex-col gap-3 z-50 pointer-events-auto">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-white">Notifications</span>
                <span className="text-[10px] text-gray-400 font-medium">{unreadCount} Unread</span>
              </div>

              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-[11px] text-gray-500 text-center py-4">No recent notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-lg border flex flex-col gap-1 text-left relative group ${
                        n.status === 'UNREAD' 
                          ? 'bg-brand-purple/5 border-brand-purple/10' 
                          : 'bg-white/2 border-white/5 opacity-75'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-bold text-white leading-snug">{n.title}</span>
                        {n.status === 'UNREAD' && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="p-1 rounded bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Mark as Read"
                          >
                            <Check className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[9px] text-gray-400 leading-normal">{n.message}</p>
                      <span className="text-[8px] text-gray-600 mt-1">
                        {formatTime(n.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile info */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center font-bold text-xs shadow-md">
            {session?.user?.name ? session.user.name[0] : 'U'}
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
