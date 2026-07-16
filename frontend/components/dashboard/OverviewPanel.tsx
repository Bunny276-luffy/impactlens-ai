'use client';

import React, { useState, useEffect } from 'react';
import { Users, HeartHandshake, Activity, Flame, RefreshCw, ChevronRight, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerContainer';
import { apiFetch } from '@/hooks/useApi';
import { formatCurrency, formatNumber } from '@/utils/format';
import { useToast } from '@/contexts/ToastContext';

const PIE_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-xl p-3 text-[11px]">
      {label && <p className="font-bold text-text-primary mb-1">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function OverviewPanel({ setActiveTab }: { setActiveTab: (t: string) => void }) {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch { toast('Failed to load analytics', { type: 'error' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { setMounted(true); fetchData(); }, []);

  const stats = data?.stats || {};
  const monthly = data?.monthly_donations || [];
  const scatter = data?.nutrition_attendance_scatter || [];
  const priority = data?.priority_distribution || {};

  const pieData = [
    { name: 'Critical', value: priority.critical || 0 },
    { name: 'High', value: priority.high || 0 },
    { name: 'Moderate', value: priority.moderate || 0 },
    { name: 'Stable', value: priority.stable || 0 },
  ].filter(d => d.value > 0);

  const METRICS = [
    {
      label: 'Total Beneficiaries', value: formatNumber(stats.total_beneficiaries || 0),
      sub: `${stats.total_ngos || 0} Active NGOs`, icon: Users, color: 'text-violet', bg: 'bg-violet-dim border-violet/20'
    },
    {
      label: 'Total Raised', value: formatCurrency(stats.total_raised || 0),
      sub: `${stats.total_donations || 0} donations`, icon: HeartHandshake, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20'
    },
    {
      label: 'Avg Nutrition Score', value: `${stats.avg_nutrition_score || 0}%`,
      sub: 'Across all beneficiaries', icon: Activity, color: 'text-mint', bg: 'bg-mint-dim border-mint/20'
    },
    {
      label: 'Active Risk Alerts', value: formatNumber(stats.health_risk_alerts || 0),
      sub: 'Priority 1 urgency', icon: Flame, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20'
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(n => <div key={n} className="h-24 skeleton rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-72 skeleton rounded-2xl" />
          <div className="h-72 skeleton rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <StaggerContainer className="flex flex-col gap-6 p-6 overflow-y-auto h-full">
      {/* Header */}
      <StaggerItem className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary">System Intelligence Summary</h2>
          <p className="text-xs text-text-muted mt-0.5">Real-time aggregated metrics across all NGO nodes</p>
        </div>
        <button
          onClick={fetchData}
          className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Data
        </button>
      </StaggerItem>

      {/* Metric Cards */}
      <StaggerItem className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="glass-card rounded-2xl p-4 flex items-start justify-between gap-3 group">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{m.label}</span>
                <span className="text-2xl font-extrabold text-text-primary">{m.value}</span>
                <span className="text-[10px] text-text-muted">{m.sub}</span>
              </div>
              <div className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center border ${m.bg} group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-4.5 h-4.5 ${m.color}`} />
              </div>
            </div>
          );
        })}
      </StaggerItem>

      {/* Charts Row 1 */}
      <StaggerItem className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="md:col-span-2 glass-panel rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div>
            <h3 className="text-sm font-bold text-text-primary">Monthly Funding Growth</h3>
            <p className="text-[10px] text-text-muted">Aggregate donation amounts and registrations over time</p>
          </div>
          <div className="h-56 relative z-10">
            {mounted && monthly.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Area type="monotone" dataKey="amount" name="Amount ($)" stroke="#8b5cf6" strokeWidth={2} fill="url(#gArea)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={Activity}
                title="No donation data yet"
                description="Connect Supabase to see live funding charts"
                size="sm"
              />
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4 group hover:border-violet/30 transition-colors duration-500">
          <div>
            <h3 className="text-sm font-bold text-text-primary">AI Priority Distribution</h3>
            <p className="text-[10px] text-text-muted">Child classification by emergency rank</p>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[160px]">
            {mounted && pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={Sparkles} title="No classifications" description="AI analysis begins after beneficiary data is added" size="sm" />
            )}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-text-muted">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>
      </StaggerItem>

      {/* Charts Row 2 */}
      <StaggerItem className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scatter */}
        <div className="md:col-span-2 glass-panel rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Nutrition vs. Attendance (Risk Map)</h3>
            <p className="text-[10px] text-text-muted">X: Nutrition %, Y: Attendance %, dot size: Risk Score</p>
          </div>
          <div className="h-56">
            {mounted && scatter.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis type="number" dataKey="nutrition" name="Nutrition" unit="%" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <YAxis type="number" dataKey="attendance" name="Attendance" unit="%" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ZAxis type="number" dataKey="risk" range={[40, 200]} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Scatter name="Beneficiaries" data={scatter} fill="#3b82f6" opacity={0.8} />
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={Activity} title="No risk data" description="Add beneficiaries with biometric data to generate risk maps" size="sm" />
            )}
          </div>
        </div>

        {/* AI Interventions */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4 neon-top">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet animate-pulse" />
            <h3 className="text-sm font-bold text-text-primary">AI Interventions</h3>
          </div>
          <EmptyState
            icon={BrainCircuit}
            title="No alerts generated"
            description="Predictions appear once Supabase is connected and beneficiary data is available"
            size="sm"
          />
          <button
            onClick={() => setActiveTab('ai')}
            className="mt-auto w-full py-2 rounded-xl bg-violet-glow border border-violet/20 text-violet text-xs font-bold
              hover:bg-violet-dim transition-all flex items-center justify-center gap-1.5"
          >
            Review AI Analytics <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}

// Fix missing import
import { BrainCircuit } from 'lucide-react';
