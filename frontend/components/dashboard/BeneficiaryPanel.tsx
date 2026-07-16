'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Search, Filter, ChevronRight, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { apiFetch } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/contexts/ToastContext';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Beneficiary {
  id: string; name: string; age: number; gender: string;
  guardian_name: string | null; school: string | null;
  nutrition_score: number | null; attendance_rate: number | null;
  ai_risk_level: string | null; created_at: string;
}

const RISK_VARIANT: Record<string, any> = {
  Critical: 'critical', High: 'critical', Moderate: 'warning', Low: 'info', Stable: 'success',
};

export default function BeneficiaryPanel() {
  const { toast } = useToast();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Beneficiary | null>(null);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search, 350);

  // Form state
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', guardian_name: '', school: '', address: '' });
  const [saving, setSaving] = useState(false);

  const fetchBeneficiaries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      const res = await apiFetch(`/api/beneficiaries?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBeneficiaries(data.data?.data || []);
      }
    } catch { toast('Failed to load beneficiaries', { type: 'error' }); }
    finally { setLoading(false); }
  }, [debouncedSearch]);

  useEffect(() => { fetchBeneficiaries(); }, [fetchBeneficiaries]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age) {
      toast('Name and age are required', { type: 'warning' });
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch('/api/beneficiaries', {
        method: 'POST',
        body: JSON.stringify({ ...form, age: Number(form.age), ngo_id: 'placeholder' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast('Beneficiary added successfully', { type: 'success', title: 'Added' });
      setAddOpen(false);
      setForm({ name: '', age: '', gender: 'Male', guardian_name: '', school: '', address: '' });
      fetchBeneficiaries();
    } catch (err: any) {
      toast(err.message || 'Failed to add beneficiary', { type: 'error' });
    }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/beneficiaries/${deleteTarget.id}`, { method: 'DELETE' });
      toast('Beneficiary removed', { type: 'success' });
      setDeleteTarget(null);
      fetchBeneficiaries();
    } catch { toast('Failed to delete beneficiary', { type: 'error' }); }
    finally { setDeleting(false); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Beneficiary Registry</h2>
          <p className="panel-subtitle">Full CRUD management of all registered beneficiaries</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary text-xs px-4 py-2">
          <Plus className="w-3.5 h-3.5" /> Add Beneficiary
        </button>
      </div>

      {/* Search & Filters */}
      <div className="px-6 py-4 border-b border-border-subtle flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-text-muted" />
          <input
            className="glass-input pl-9 text-xs h-9"
            placeholder="Search by name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" /> Filter
        </button>
        <span className="text-xs text-text-muted ml-auto">{beneficiaries.length} records</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner size="md" />
          </div>
        ) : beneficiaries.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title="No beneficiaries yet"
              description="Add the first beneficiary to start tracking progress and generating AI analytics"
              size="lg"
              action={
                <button onClick={() => setAddOpen(true)} className="btn-primary text-xs px-5 py-2.5">
                  <Plus className="w-3.5 h-3.5" /> Add First Beneficiary
                </button>
              }
            />
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>School</th>
                <th>Nutrition</th>
                <th>Attendance</th>
                <th>AI Risk</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map(b => (
                <tr key={b.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-violet-dim border border-violet/20 flex items-center justify-center text-[10px] font-bold text-violet shrink-0">
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary text-xs">{b.name}</p>
                        {b.guardian_name && <p className="text-[10px] text-text-muted">{b.guardian_name}</p>}
                      </div>
                    </div>
                  </td>
                  <td>{b.age}</td>
                  <td>{b.gender}</td>
                  <td>{b.school || <span className="text-text-muted">—</span>}</td>
                  <td>
                    {b.nutrition_score != null ? (
                      <div className="flex items-center gap-1.5">
                        <div className="h-1 w-12 rounded-full bg-surface-2 overflow-hidden">
                          <div className="h-full bg-mint rounded-full" style={{ width: `${b.nutrition_score}%` }} />
                        </div>
                        <span className="text-[10px]">{b.nutrition_score}%</span>
                      </div>
                    ) : <span className="text-text-muted">—</span>}
                  </td>
                  <td>{b.attendance_rate != null ? `${b.attendance_rate}%` : <span className="text-text-muted">—</span>}</td>
                  <td>
                    {b.ai_risk_level
                      ? <Badge variant={RISK_VARIANT[b.ai_risk_level] || 'neutral'} dot>{b.ai_risk_level}</Badge>
                      : <span className="text-text-muted text-[10px]">—</span>}
                  </td>
                  <td>{formatDate(b.created_at)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="h-7 w-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-white/[0.05] transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(b)}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Beneficiary" description="Register a new child beneficiary in the system" size="md">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Full Name *</label>
              <input className="glass-input text-sm" placeholder="Vikram Singh" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Age *</label>
              <input type="number" min="1" max="25" className="glass-input text-sm" placeholder="8" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Gender *</label>
              <select className="glass-input text-sm" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Guardian Name</label>
              <input className="glass-input text-sm" placeholder="Parent / Guardian" value={form.guardian_name} onChange={e => setForm(f => ({ ...f, guardian_name: e.target.value }))} />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">School</label>
              <input className="glass-input text-sm" placeholder="Government School No. 12" value={form.school} onChange={e => setForm(f => ({ ...f, school: e.target.value }))} />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Address</label>
              <input className="glass-input text-sm" placeholder="Lajpat Nagar, Delhi" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-ghost text-xs px-4 py-2">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-xs px-5 py-2">
              {saving ? <Spinner size="xs" /> : null}
              Add Beneficiary
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Beneficiary"
        message={`Are you sure you want to permanently delete ${deleteTarget?.name}? All associated records will be removed.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </div>
  );
}
