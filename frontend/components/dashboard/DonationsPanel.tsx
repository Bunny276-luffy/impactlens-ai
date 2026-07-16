'use client';

import React, { useState, useEffect } from 'react';
import { HeartHandshake, Plus, DollarSign, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { apiFetch } from '@/hooks/useApi';
import { useToast } from '@/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/utils/format';

interface Donation {
  id: string; amount: number; currency: string; category: string;
  status: string; note: string | null; created_at: string;
}

const STATUS_VARIANT: Record<string, any> = {
  Pending: 'warning', Confirmed: 'info', Disbursed: 'success', Refunded: 'neutral',
};

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10b981', Education: '#3b82f6', Health: '#ec4899',
  Infrastructure: '#f59e0b', General: '#8b5cf6',
};

export default function DonationsPanel() {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ amount: '', category: 'Food', note: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setMounted(true); fetchDonations(); }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/donations');
      if (res.ok) {
        const data = await res.json();
        setDonations(data.data?.data || []);
      }
    } catch { toast('Failed to load donations', { type: 'error' }); }
    finally { setLoading(false); }
  };

  const totalRaised = donations.reduce((s, d) => s + (d.status !== 'Refunded' ? d.amount : 0), 0);
  
  const categoryData = Object.entries(
    donations.reduce((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + d.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount) { toast('Amount required', { type: 'warning' }); return; }
    setSaving(true);
    try {
      const res = await apiFetch('/api/donations', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(form.amount), category: form.category, note: form.note, ngo_id: 'placeholder' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast('Donation recorded', { type: 'success', title: 'Recorded' });
      setAddOpen(false);
      fetchDonations();
    } catch (err: any) {
      toast(err.message, { type: 'error' });
    } finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Donation Ledger</h2>
          <p className="panel-subtitle">Track all donations, allocations, and impact deployments</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary text-xs px-4 py-2">
          <Plus className="w-3.5 h-3.5" /> Record Donation
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-mint" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Raised</span>
            </div>
            <span className="text-2xl font-extrabold text-text-primary">{formatCurrency(totalRaised)}</span>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cyan" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Donations</span>
            </div>
            <span className="text-2xl font-extrabold text-text-primary">{donations.length}</span>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieIcon className="w-4 h-4 text-violet" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Disbursed</span>
            </div>
            <span className="text-2xl font-extrabold text-text-primary">{donations.filter(d => d.status === 'Disbursed').length}</span>
          </div>
        </div>

        {/* Chart */}
        {mounted && categoryData.length > 0 && (
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-sm font-bold text-text-primary mb-4">Allocation by Category</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0d0e17', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px' }}
                    formatter={(v: any) => [formatCurrency(v), 'Amount']}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-48"><Spinner /></div>
        ) : donations.length === 0 ? (
          <EmptyState
            icon={HeartHandshake}
            title="No donations recorded"
            description="Record donations to track fundraising progress and generate impact reports for donors"
            size="lg"
            action={<button onClick={() => setAddOpen(true)} className="btn-primary text-xs px-5 py-2.5"><Plus className="w-3.5 h-3.5" />Record First Donation</button>}
          />
        ) : (
          <table className="data-table">
            <thead><tr><th>Amount</th><th>Category</th><th>Status</th><th>Note</th><th>Date</th></tr></thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id}>
                  <td><span className="font-bold text-text-primary">{formatCurrency(d.amount, d.currency)}</span></td>
                  <td>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[d.category] || '#8b5cf6' }} />
                      {d.category}
                    </span>
                  </td>
                  <td><Badge variant={STATUS_VARIANT[d.status] || 'neutral'}>{d.status}</Badge></td>
                  <td>{d.note || <span className="text-text-muted">—</span>}</td>
                  <td>{formatDate(d.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Record Donation" size="sm">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Amount (USD) *</label>
            <input type="number" min="1" required className="glass-input text-sm" placeholder="5000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Category *</label>
            <select className="glass-input text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {['Food', 'Education', 'Health', 'Infrastructure', 'General'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Note</label>
            <input className="glass-input text-sm" placeholder="Emergency nutrition supplies…" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-ghost text-xs px-4 py-2">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-xs px-5 py-2">{saving && <Spinner size="xs" />}Record</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
