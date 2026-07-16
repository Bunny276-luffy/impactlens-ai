'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { DashboardNavbar } from '@/components/dashboard/Navbar';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { Constellation } from '@/components/ui/Constellation';

// Lazy-load panels to keep initial bundle small
const OverviewPanel = dynamic(() => import('@/components/dashboard/OverviewPanel'), { ssr: false });
const BeneficiaryPanel = dynamic(() => import('@/components/dashboard/BeneficiaryPanel'), { ssr: false });
const ProgramPanel = dynamic(() => import('@/components/dashboard/ProgramPanel'), { ssr: false });
const VolunteerPanel = dynamic(() => import('@/components/dashboard/VolunteerPanel'), { ssr: false });
const FieldActivitiesPanel = dynamic(() => import('@/components/dashboard/FieldActivitiesPanel'), { ssr: false });
const AIAnalyticsPanel = dynamic(() => import('@/components/dashboard/AIAnalyticsPanel'), { ssr: false });
const DonationsPanel = dynamic(() => import('@/components/dashboard/DonationsPanel'), { ssr: false });
const ReportsPanel = dynamic(() => import('@/components/dashboard/ReportsPanel'), { ssr: false });
const OrganizationPanel = dynamic(() => import('@/components/dashboard/OrganizationPanel'), { ssr: false });

const PANELS: Record<string, React.ComponentType<any>> = {
  overview: OverviewPanel,
  beneficiaries: BeneficiaryPanel,
  programs: ProgramPanel,
  volunteers: VolunteerPanel,
  activities: FieldActivitiesPanel,
  ai: AIAnalyticsPanel,
  donations: DonationsPanel,
  reports: ReportsPanel,
  organization: OrganizationPanel,
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const Panel = PANELS[activeTab] || OverviewPanel;
  const panelProps = activeTab === 'overview' ? { setActiveTab } : {};

  return (
    <div className="flex h-screen bg-obsidian overflow-hidden">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardNavbar activeTab={activeTab} />
        <main className="flex-1 overflow-hidden bg-obsidian-deep relative">
          <Constellation />
          
          {/* Subtle background glow for dashboard area */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-glow blur-[120px] rounded-full pointer-events-none mix-blend-screen opacity-20" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full w-full"
            >
              <React.Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="h-8 w-8 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
                </div>
              }>
                <Panel {...panelProps} />
              </React.Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
