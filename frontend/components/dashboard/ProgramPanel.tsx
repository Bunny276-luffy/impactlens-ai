'use client';

import React, { useState, useEffect } from 'react';
import { FolderGit2, Plus, Search, Grid3x3, List, Layers } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { apiFetch } from '@/hooks/useApi';
import { useToast } from '@/contexts/ToastContext';
import { formatDate, formatCurrency } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Program {
  id: string; name: string; description: string | null;
  category: string; status: string; start_date: string | null;
  end_date: string | null; budget: number | null; beneficiary_count: number;
  created_at: string;
}

const STATUS_VARIANT: Record<string, any> = {
  Active: 'success', Paused: 'warning', Completed: 'neutral', Draft: 'info',
};

const CATEGORY_COLOR: Record<string, string> = {
  Education: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Nutrition: 'text-mint bg-mint-dim border-mint/20',
  Health: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  Vocational: 'text-violet bg-violet-dim border-violet/20',
  General: 'text-text-secondary bg-white/5 border-border-default',
};

export default function ProgramPanel() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'Education', start_date: '', budget: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPrograms(); }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/programs');
      if (res.ok) {
        const data = await res.json();
        setPrograms(data.data?.data || []);
      }
    } catch { toast('Failed to load programs', { type: 'error' }); }
    finally { setLoading(false); }
  };

  const filtered = programs.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/api/programs', {
        method: 'POST',
        body: JSON.stringify({ ...form, ngo_id: 'placeholder', budget: form.budget ? Number(form.budget) : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast('Program created', { type: 'success', title: 'Created' });
      setAddOpen(false);
      fetchPrograms();
    } catch (err: any) {
      toast(err.message, { type: 'error' });
    } finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Program Management</h2>
          <p className="panel-subtitle">Plan, track, and manage all NGO welfare programs</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border-subtle overflow-hidden">
            {(['grid', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={cn('p-2 transition-all', view === v ? 'bg-white/[0.08] text-text-primary' : 'text-text-muted hover:text-text-primary')}
              >
                {v === 'grid' ? <Grid3x3 className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
          <button onClick={() => setAddOpen(true)} className="btn-primary text-xs px-4 py-2">
            <Plus className="w-3.5 h-3.5" /> New Program
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-border-subtle">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-text-muted" />
          <input className="glass-input pl-9 text-xs h-9" placeholder="Search programs…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-48"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title="No programs yet"
            description="Create your first welfare program to start enrolling beneficiaries and tracking outcomes"
            size="lg"
            action={<button onClick={() => setAddOpen(true)} className="btn-primary text-xs px-5 py-2.5"><Plus className="w-3.5 h-3.5" />Create Program</button>}
          />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="glass-card rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border', CATEGORY_COLOR[p.category] || CATEGORY_COLOR.General)}>{p.category}</span>
                    <h3 className="text-sm font-bold text-text-primary mt-2">{p.name}</h3>
                    {p.description && <p className="text-xs text-text-muted mt-1 line-clamp-2">{p.description}</p>}
                  </div>
                  <Badge variant={STATUS_VARIANT[p.status] || 'neutral'}>{p.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-text-muted">Beneficiaries</span>
                    <p className="font-bold text-text-primary">{p.beneficiary_count}</p>
                  </div>
                  {p.budget && (
                    <div>
                      <span className="text-text-muted">Budget</span>
                      <p className="font-bold text-text-primary">{formatCurrency(p.budget)}</p>
                    </div>
                  )}
                  {p.start_date && (
                    <div>
                      <span className="text-text-muted">Start Date</span>
                      <p className="font-bold text-text-primary">{formatDate(p.start_date)}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Name</th><th>Category</th><th>Status</th><th>Beneficiaries</th><th>Budget</th><th>Start Date</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span className="font-semibold text-text-primary text-xs">{p.name}</span></td>
                  <td><span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold border', CATEGORY_COLOR[p.category] || CATEGORY_COLOR.General)}>{p.category}</span></td>
                  <td><Badge variant={STATUS_VARIANT[p.status] || 'neutral'}>{p.status}</Badge></td>
                  <td>{p.beneficiary_count}</td>
                  <td>{p.budget ? formatCurrency(p.budget) : '—'}</td>
                  <td>{p.start_date ? formatDate(p.start_date) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create Program" size="md">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Program Name *</label>
            <input className="glass-input text-sm" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nutrition Support Initiative" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Description</label>
            <textarea rows={3} className="glass-input text-sm resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the program objectives and approach…" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Category *</label>
              <select className="glass-input text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Education', 'Nutrition', 'Health', 'Vocational', 'General'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Budget ($)</label>
              <input type="number" className="glass-input text-sm" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="50000" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Start Date</label>
            <input type="date" className="glass-input text-sm" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-ghost text-xs px-4 py-2">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-xs px-5 py-2">{saving && <Spinner size="xs" />}Create Program</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
