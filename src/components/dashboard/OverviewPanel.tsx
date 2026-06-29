'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  HeartHandshake, 
  Flame, 
  Activity, 
  ChevronRight, 
  Award,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useToast } from '@/contexts/ToastContext';

export default function OverviewPanel({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        toast('Failed to load analytics datasets.', { type: 'error' });
      }
    } catch (err) {
      console.error(err);
      toast('Network error loading analytics.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 animate-pulse-subtle">
        {/* Metric grid skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-24 rounded-xl skeleton border border-white/5" />
          ))}
        </div>
        {/* Chart skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-64 rounded-xl skeleton border border-white/5" />
          <div className="h-64 rounded-xl skeleton border border-white/5" />
        </div>
      </div>
    );
  }

  const { stats, predictions, charts } = data || {
    stats: {}, predictions: {}, charts: {}
  };

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#10b981'];

  // Priority data mapping for Pie
  const priorityPieData = [
    { name: 'P1: Critical', value: predictions?.priorityDistribution?.p1 ?? 0 },
    { name: 'P2: High Risk', value: predictions?.priorityDistribution?.p2 ?? 0 },
    { name: 'P3: Moderate', value: predictions?.priorityDistribution?.p3 ?? 0 },
    { name: 'P5: Stable/Talented', value: (predictions?.priorityDistribution?.p4 ?? 0) + (predictions?.priorityDistribution?.p5 ?? 0) }
  ].filter(d => d.value > 0);

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {/* Top Header stats action button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">System Intelligence Summary</h2>
          <p className="text-xs text-gray-400">Aggregated real-time metrics across all NGO nodes.</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Data
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="p-4 rounded-xl glass-card flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total Children</span>
            <span className="text-2xl font-extrabold text-white">{stats.totalChildren}</span>
            <span className="text-[9px] text-gray-400 font-semibold">{stats.totalNGOs} Active NGOs</span>
          </div>
          <div className="h-9 w-9 rounded-lg bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
            <Users className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl glass-card flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total Raised</span>
            <span className="text-2xl font-extrabold text-gradient-purple-blue">${stats.totalDonated?.toLocaleString()}</span>
            <span className="text-[9px] text-emerald-400 font-semibold">{stats.activeDonations} Sponsors</span>
          </div>
          <div className="h-9 w-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <HeartHandshake className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl glass-card flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Avg Nutrition</span>
            <span className="text-2xl font-extrabold text-white">{stats.nutritionScore}%</span>
            <span className="text-[9px] text-emerald-400 font-semibold">+4.2% growth check</span>
          </div>
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl glass-card flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Active Risk Alerts</span>
            <span className="text-2xl font-extrabold text-red-500">{stats.healthRiskAlerts}</span>
            <span className="text-[9px] text-red-400 font-semibold">Priority 1 urgency</span>
          </div>
          <div className="h-9 w-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Flame className="w-4.5 h-4.5" />
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Donations Growth Chart */}
        <div className="md:col-span-2 p-5 rounded-2xl glass-panel text-left flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">Monthly Funding & Enrollment Growth</h3>
            <p className="text-[10px] text-gray-500">Longitudinal aggregate donation amounts ($) and child registrations count.</p>
          </div>
          <div className="h-64 w-full text-xs">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.monthlyDonations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#4b5563" fontSize={10} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#11131e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#c084fc', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="donations" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorDonations)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Priority Pie Chart */}
        <div className="p-5 rounded-2xl glass-panel text-left flex flex-col gap-4 justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">AI Priority Distributions</h3>
            <p className="text-[10px] text-gray-500">Child classification breakdown by emergency ranking.</p>
          </div>
          
          <div className="h-44 w-full flex justify-center items-center">
            {priorityPieData.length === 0 ? (
              <p className="text-xs text-gray-500">No priority classifications found.</p>
            ) : (
              mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {priorityPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#11131e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '10px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-gray-400">
            {priorityPieData.map((d, index) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Secondary Row: Scatter Chart & AI Recommendations Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Scatter Chart */}
        <div className="md:col-span-2 p-5 rounded-2xl glass-panel text-left flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">Nutrition vs. Attendance (Risk Mapping)</h3>
            <p className="text-[10px] text-gray-500">Correlation mapping. X-axis: Nutrition Score (%), Y-axis: Attendance (%). Size of dot matches AI Risk Level.</p>
          </div>
          <div className="h-64 w-full text-xs">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis type="number" dataKey="nutrition" name="Nutrition" unit="%" stroke="#4b5563" fontSize={10} tickLine={false} domain={[20, 100]} />
                  <YAxis type="number" dataKey="attendance" name="Attendance" unit="%" stroke="#4b5563" fontSize={10} tickLine={false} domain={[50, 100]} />
                  <ZAxis type="number" dataKey="risk" range={[40, 240]} name="Risk Score" unit="%" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ background: '#11131e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '10px' }}
                  />
                  <Scatter name="Children Risk Metrics" data={charts.nutritionScatter} fill="#3b82f6" opacity={0.8} />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* AI Action Steps */}
        <div className="p-5 rounded-2xl glass-panel text-left flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-brand-purple">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Suggested Interventions</h3>
            </div>
            <p className="text-[10px] text-gray-500">AI priorities computed based on biometric updates.</p>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto py-2">
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-950/10 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Priority 1 (Health)</span>
                <span className="text-[9px] text-gray-500">Urgent</span>
              </div>
              <p className="text-[11px] text-red-200 leading-normal">
                Deploy RUTF paste packs to **Vikram Singh** (Age 7). High malnutrition index warning.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-950/10 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Priority 2 (Academic)</span>
                <span className="text-[9px] text-gray-500">Counselor visit</span>
              </div>
              <p className="text-[11px] text-amber-200 leading-normal">
                Speak to guardian of **Amit Patel** (Attendance: 68%). Initiate labor counseling dialog.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('ai-predictions')}
            className="w-full py-2 bg-brand-purple/10 border border-brand-purple/20 hover:bg-brand-purple/20 text-brand-purple rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mt-2"
          >
            Review all Predictions
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
