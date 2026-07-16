'use client';

import React, { useState, useEffect } from 'react';
import { BrainCircuit, AlertTriangle, TrendingDown, Sparkles, RefreshCw } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { apiFetch } from '@/hooks/useApi';
import { useToast } from '@/contexts/ToastContext';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

interface AIRecommendation {
  id: string; beneficiary_id: string; beneficiary_name: string;
  priority: string; category: string; recommendation: string;
  confidence_score: number; generated_at: string;
}

const PRIORITY_STYLE: Record<string, { variant: any; label: string; border: string; bg: string }> = {
  P1: { variant: 'critical', label: 'Priority 1 — Critical', border: 'border-red-500/20', bg: 'bg-red-500/5' },
  P2: { variant: 'critical', label: 'Priority 2 — High Risk', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
  P3: { variant: 'warning', label: 'Priority 3 — Moderate', border: 'border-blue-500/20', bg: 'bg-blue-500/5' },
  P4: { variant: 'info', label: 'Priority 4 — Low Risk', border: 'border-border-default', bg: 'bg-white/[0.01]' },
  P5: { variant: 'success', label: 'Priority 5 — Stable', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
};

export default function AIAnalyticsPanel() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRecommendations(); }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/ai?ngo_id=placeholder');
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.data || []);
      }
    } catch { toast('Failed to load AI analytics', { type: 'error' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">AI Analytics & Predictions</h2>
          <p className="panel-subtitle">Machine learning–powered risk scores and intervention recommendations</p>
        </div>
        <button onClick={fetchRecommendations} className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Info Banner */}
      <div className="mx-6 mt-4 p-4 rounded-2xl border border-cyan/15 bg-cyan-glow flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-cyan shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-text-primary">AI Analytics Ready for Integration</p>
          <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
            Once Supabase is connected and beneficiary data is populated, the AI engine will automatically compute risk scores based on nutrition, attendance, and growth trajectories. All recommendations will appear here in real time.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-48"><Spinner /></div>
        ) : recommendations.length === 0 ? (
          <div className="space-y-6">
            <EmptyState
              icon={BrainCircuit}
              title="No AI predictions generated"
              description="The AI engine generates recommendations when beneficiary health and attendance data is available in the database"
              size="lg"
            />

            {/* How it works */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                How the AI Risk Engine Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: '01', title: 'Biometric Input', desc: 'Volunteers log height, weight, and attendance from the field' },
                  { step: '02', title: 'Risk Scoring', desc: 'The engine computes longitudinal curves to detect dropout and malnutrition risk' },
                  { step: '03', title: 'Intervention', desc: 'Coordinators receive prioritized action lists with specific recommendations' },
                ].map(s => (
                  <div key={s.step} className="flex gap-3">
                    <span className="text-[10px] font-black font-mono text-text-muted border border-border-default rounded-lg px-2 py-1 h-fit shrink-0">{s.step}</span>
                    <div>
                      <h4 className="text-xs font-bold text-text-primary">{s.title}</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {recommendations.map(r => {
              const style = PRIORITY_STYLE[r.priority] || PRIORITY_STYLE.P4;
              return (
                <div key={r.id} className={cn('p-5 rounded-2xl border flex flex-col gap-3', style.border, style.bg)}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <Badge variant={style.variant}>{style.label}</Badge>
                      <h3 className="text-sm font-bold text-text-primary mt-2">{r.beneficiary_name}</h3>
                      <p className="text-[10px] text-text-muted capitalize">{r.category} Intervention</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-text-muted">Confidence</p>
                      <p className="text-lg font-extrabold text-text-primary">{Math.round(r.confidence_score * 100)}%</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{r.recommendation}</p>
                  <p className="text-[10px] text-text-muted">Generated {formatDate(r.generated_at)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
