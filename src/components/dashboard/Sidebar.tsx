'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  BrainCircuit, 
  HeartHandshake, 
  CalendarCheck, 
  FileSpreadsheet 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || 'NGO';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['ADMIN', 'NGO', 'DONOR', 'VOLUNTEER'] },
    { id: 'children', label: 'Children Hub', icon: Users, roles: ['ADMIN', 'NGO', 'DONOR', 'VOLUNTEER'] },
    { id: 'ai-predictions', label: 'AI Analytics', icon: BrainCircuit, roles: ['ADMIN', 'NGO'] },
    { id: 'donations', label: 'Donations', icon: HeartHandshake, roles: ['ADMIN', 'NGO', 'DONOR'] },
    { id: 'tasks', label: 'Tasks & Visits', icon: CalendarCheck, roles: ['ADMIN', 'NGO', 'VOLUNTEER'] },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet, roles: ['ADMIN', 'NGO', 'DONOR', 'VOLUNTEER'] }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 border-r border-white/8 bg-bg-darker flex flex-col h-screen shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue shadow-md">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white">
            ImpactLens <span className="text-brand-purple">AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation menu items */}
      <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                isActive 
                  ? 'bg-brand-purple/10 border-l-2 border-brand-purple text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/3'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-purple' : 'text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Footer block */}
      <div className="p-4 border-t border-white/8 bg-bg-darker/60 text-xs flex flex-col gap-1">
        <span className="text-gray-400 font-semibold truncate">{session?.user?.name || 'Loading...'}</span>
        <span className="text-[10px] text-gray-500 truncate">{session?.user?.email || 'Loading...'}</span>
      </div>
    </aside>
  );
}
