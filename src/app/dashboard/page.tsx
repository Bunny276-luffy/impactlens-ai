'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardSidebar from '@/components/dashboard/Sidebar';
import DashboardNavbar from '@/components/dashboard/Navbar';
import OverviewPanel from '@/components/dashboard/OverviewPanel';
import ChildManagementPanel from '@/components/dashboard/ChildManagementPanel';
import AIPredictionsPanel from '@/components/dashboard/AIPredictionsPanel';
import DonorPortalPanel from '@/components/dashboard/DonorPortalPanel';
import VolunteerPortalPanel from '@/components/dashboard/VolunteerPortalPanel';
import ReportsPanel from '@/components/dashboard/ReportsPanel';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');

  // Handle access control and routing
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Set default tab based on user role to make experience smoother
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const role = (session.user as any).role;
      if (role === 'DONOR') {
        setActiveTab('donations');
      } else if (role === 'VOLUNTEER') {
        setActiveTab('tasks');
      } else {
        setActiveTab('overview');
      }
    }
  }, [status, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-bg-dark text-white flex flex-col justify-center items-center gap-3">
        <span className="h-8 w-8 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
        <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase animate-pulse-subtle">
          Authenticating Session...
        </span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex h-screen bg-bg-dark overflow-hidden text-white">
      {/* Sidebar navigation */}
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Navbar */}
        <DashboardNavbar />

        {/* Dashboard Content area */}
        <main className="flex-1 overflow-hidden bg-bg-dark/40 relative">
          {activeTab === 'overview' && <OverviewPanel setActiveTab={setActiveTab} />}
          {activeTab === 'children' && <ChildManagementPanel />}
          {activeTab === 'ai-predictions' && <AIPredictionsPanel />}
          {activeTab === 'donations' && <DonorPortalPanel />}
          {activeTab === 'tasks' && <VolunteerPortalPanel />}
          {activeTab === 'reports' && <ReportsPanel />}
        </main>
      </div>
    </div>
  );
}
