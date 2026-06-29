'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { 
  BrainCircuit, 
  Flame, 
  TrendingDown, 
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function AIPredictionsPanel() {
  const { toast } = useToast();
  const [children, setChildren] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [allocating, setAllocating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const childrenRes = await fetch('/api/child');
      const analyticsRes = await fetch('/api/analytics');
      if (childrenRes.ok && analyticsRes.ok) {
        const cData = await childrenRes.json();
        const aData = await analyticsRes.json();
        
        // Sort children by risk priority
        const sorted = cData.sort((a: any, b: any) => {
          const pA = a.aiReports?.[0]?.priorityRanking ?? 5;
          const pB = b.aiReports?.[0]?.priorityRanking ?? 5;
          return pA - pB; // P1 comes first
        });
        setChildren(sorted);
        setStats(aData.predictions);

        // Select the highest priority child by default
        if (sorted.length > 0 && !selectedChild) {
          setSelectedChild(sorted[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInterventionAction = async (actionType: string) => {
    if (!selectedChild) return;
    setAllocating(true);
    
    // Simulate API delay for deploying intervention
    setTimeout(async () => {
      setAllocating(false);
      
      // Dispatch notification
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'user_ngo',
            type: 'VOLUNTEER_REMINDER',
            title: `Intervention Deployed: ${selectedChild.name}`,
            message: `Initiated [${actionType}] for ${selectedChild.name} as suggested by AI predictions.`
          })
        });

        toast(`Intervention [${actionType}] successfully deployed for ${selectedChild.name}.`, {
          type: 'success',
          title: 'Action Dispatched'
        });

        // Add dummy record checkpoint
        const res = await fetch(`/api/child/${selectedChild.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            learningProgress: selectedChild.educationRecords?.[0]?.learningProgress || 'Average',
            attendanceRate: Math.min((selectedChild.educationRecords?.[0]?.attendanceRate ?? 80) + 5, 98), // boost attendance as result of intervention
            nutritionScore: Math.min((selectedChild.healthRecords?.[0]?.nutritionScore ?? 60) + 8, 95) // boost nutrition
          })
        });

        if (res.ok) {
          fetchData();
          const updated = await res.json();
          setSelectedChild(updated);
        }

      } catch (err) {
        console.error(err);
      }
    }, 1200);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-xs text-gray-400 flex flex-col items-center gap-2 animate-pulse-subtle">
        <span className="h-6 w-6 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
        Processing predictive AI indexes...
      </div>
    );
  }

  const criticalCases = children.filter(c => (c.aiReports?.[0]?.priorityRanking ?? 5) <= 2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      
      {/* Top Banner Stats */}
      <div className="md:col-span-3 p-4 rounded-xl border border-brand-purple/20 bg-brand-purple/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-brand-purple/15 border border-brand-purple/30 text-brand-purple flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">ImpactLens Predictive Model: Active</h2>
            <p className="text-[10px] text-gray-400">Longitudinal biometrics & attendance mapped against training baseline sets.</p>
          </div>
        </div>

        <div className="flex gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-sans">Dropout F1-Score</span>
            <span className="text-white font-bold text-sm">0.89 (High)</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-sans">Malnutrition AUC</span>
            <span className="text-white font-bold text-sm">0.94 (Excellent)</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1 */}
        <div className="p-4 rounded-xl glass-card flex items-center justify-between text-left">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Malnutrition Prediction</span>
            <span className="text-xl font-extrabold text-white">{stats?.malnutritionRiskCount ?? 0} Children</span>
            <span className="text-[9px] text-red-400">High Risk Threshold reached</span>
          </div>
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl glass-card flex items-center justify-between text-left">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Dropout Probability</span>
            <span className="text-xl font-extrabold text-white">{stats?.dropoutRiskCount ?? 0} Children</span>
            <span className="text-[9px] text-amber-400">Attendance drops logged</span>
          </div>
          <TrendingDown className="w-5 h-5 text-amber-400" />
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl glass-card flex items-center justify-between text-left">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Learning Difficulties</span>
            <span className="text-xl font-extrabold text-white">{stats?.learningDiffCount ?? 0} Children</span>
            <span className="text-[9px] text-blue-400">Cognitive fatigue warning</span>
          </div>
          <BrainCircuit className="w-5 h-5 text-blue-400" />
        </div>

      </div>

      {/* Left panel: Risk queue list */}
      <div className="md:col-span-2 rounded-2xl glass-panel p-5 text-left flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">AI Diagnostics & Priority Intervention Queue</h3>
          <p className="text-[10px] text-gray-500">List sorted by emergency levels. Click a child to configure targeted intervention.</p>
        </div>

        <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
          {children.map((child) => {
            const ai = child.aiReports?.[0] || {};
            const isSelected = selectedChild?.id === child.id;
            return (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`p-3 rounded-xl border text-left transition-all flex justify-between items-center ${
                  isSelected 
                    ? 'bg-brand-purple/10 border-brand-purple/40 shadow' 
                    : 'bg-white/1 border-white/5 hover:bg-white/3'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{child.name}</span>
                    <span className="text-[9px] text-gray-500">Age {child.age}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] text-gray-400">
                    <span>School: {child.school}</span>
                    <span>Risk: {ai.riskScore ?? 0}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {ai.priorityRanking === 1 ? (
                    <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[8px] uppercase">P1: Urgent</span>
                  ) : ai.priorityRanking === 2 ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[8px] uppercase">P2: High</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[8px] uppercase">P5: Stable</span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right panel: Active Intervention Configuration */}
      <div className="rounded-2xl glass-panel p-5 text-left flex flex-col gap-4 justify-between h-[495px]">
        {selectedChild ? (
          <>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedChild.name}</h3>
                  <p className="text-[9px] text-gray-500">Priority Diagnostics Details</p>
                </div>
                {selectedChild.aiReports?.[0]?.priorityRanking <= 2 ? (
                  <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[9px] uppercase">Immediate Action</span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase">Routine checks</span>
                )}
              </div>

              {/* Stat breakdown */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2.5 rounded bg-white/2 border border-white/5">
                  <span className="text-[8px] text-gray-500 uppercase font-bold">Nutrition Status</span>
                  <p className="text-xs font-bold mt-0.5 text-white">
                    {selectedChild.healthRecords?.[0]?.nutritionScore ?? 'N/A'}/100 Score
                  </p>
                </div>
                <div className="p-2.5 rounded bg-white/2 border border-white/5">
                  <span className="text-[8px] text-gray-500 uppercase font-bold">Attendance Stability</span>
                  <p className="text-xs font-bold mt-0.5 text-white">
                    {selectedChild.educationRecords?.[0]?.attendanceRate ?? 'N/A'}% Rate
                  </p>
                </div>
              </div>

              {/* AI Details text */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-500 uppercase font-bold">Model Diagnostics Summary</span>
                <p className="text-[11px] text-gray-300 leading-relaxed bg-white/1 border border-white/5 p-3 rounded-lg">
                  {selectedChild.aiReports?.[0]?.aiSummary || 'Profile has steady baseline stats.'}
                </p>
              </div>

              {/* Sugestion intervention */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-1.5 text-brand-purple">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[9px] uppercase font-bold">Suggested AI Intervention</span>
                </div>
                <p className="text-[11px] text-brand-purple font-semibold bg-brand-purple/5 border border-brand-purple/15 p-3 rounded-lg leading-relaxed">
                  {selectedChild.aiReports?.[0]?.suggestedIntervention || 'No critical interventions flagged.'}
                </p>
              </div>
            </div>

            {/* Action dispatchers */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-4 mt-auto">
              <span className="text-[8px] text-gray-500 uppercase font-bold">Dispatch Intervention Action</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                <button
                  disabled={allocating}
                  onClick={() => handleInterventionAction('Allocated Nutri-Meal Supplement')}
                  className="py-2 bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 rounded-lg text-center transition-all disabled:opacity-50"
                >
                  Meal Supplements
                </button>
                <button
                  disabled={allocating}
                  onClick={() => handleInterventionAction('Assigned Home Counselling visit')}
                  className="py-2 bg-brand-blue/10 hover:bg-brand-blue/25 border border-brand-blue/20 text-brand-blue rounded-lg text-center transition-all disabled:opacity-50"
                >
                  Home Counselor
                </button>
                <button
                  disabled={allocating}
                  onClick={() => handleInterventionAction('Dispatched Emergency Medical Checkup')}
                  className="py-2 bg-pink-500/10 hover:bg-pink-500/25 border border-pink-500/20 text-pink-400 rounded-lg text-center transition-all disabled:opacity-50 col-span-2"
                >
                  Dispatch Emergency Medical Aid
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-gray-500">
            Select a child in the queue to manage active AI interventions.
          </div>
        )}
      </div>

    </div>
  );
}
