'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, CheckCircle2, Clock, AlertCircle, Search } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { apiFetch } from '@/hooks/useApi';
import { useToast } from '@/contexts/ToastContext';
import { formatDate, initials } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Volunteer {
  id: string; name: string; email: string; phone: string | null;
  specialization: string | null; status: string; tasks_completed: number; joined_at: string;
}

const STATUS_VARIANT: Record<string, any> = { Active: 'success', Inactive: 'neutral', 'On Leave': 'warning' };

export default function VolunteerPanel() {
  const { toast } = useToast();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialization: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchVolunteers(); }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/volunteers');
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data.data?.data || []);
      }
    } catch { toast('Failed to load volunteers', { type: 'error' }); }
    finally { setLoading(false); }
  };

  const filtered = volunteers.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) { toast('Name and email required', { type: 'warning' }); return; }
    setSaving(true);
    try {
      const res = await apiFetch('/api/volunteers', {
        method: 'POST',
        body: JSON.stringify({ ...form, ngo_id: 'placeholder', user_id: 'placeholder' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast('Volunteer added', { type: 'success', title: 'Added' });
      setAddOpen(false);
      setForm({ name: '', email: '', phone: '', specialization: '' });
      fetchVolunteers();
    } catch (err: any) {
      toast(err.message, { type: 'error' });
    } finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Volunteer Roster</h2>
          <p className="panel-subtitle">Manage your field volunteer team and task assignments</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary text-xs px-4 py-2">
          <Plus className="w-3.5 h-3.5" /> Add Volunteer
        </button>
      </div>

      {/* Stats Row */}
      <div className="px-6 py-4 border-b border-border-subtle flex items-center gap-6">
        {[
          { label: 'Total', value: volunteers.length, icon: UserCheck, color: 'text-cyan' },
          { label: 'Active', value: volunteers.filter(v => v.status === 'Active').length, icon: CheckCircle2, color: 'text-mint' },
          { label: 'On Leave', value: volunteers.filter(v => v.status === 'On Leave').length, icon: Clock, color: 'text-amber-400' },
          { label: 'Inactive', value: volunteers.filter(v => v.status === 'Inactive').length, icon: AlertCircle, color: 'text-text-muted' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-2">
              <Icon className={cn('w-3.5 h-3.5', s.color)} />
              <span className="text-xs text-text-muted">{s.label}:</span>
              <span className="text-xs font-bold text-text-primary">{s.value}</span>
            </div>
          );
        })}
        <div className="ml-auto relative max-w-xs">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-text-muted" />
          <input className="glass-input pl-9 text-xs h-9" placeholder="Search volunteers…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={UserCheck}
              title="No volunteers yet"
              description="Add volunteers to start assigning field tasks and tracking activity logs"
              size="lg"
              action={<button onClick={() => setAddOpen(true)} className="btn-primary text-xs px-5 py-2.5"><Plus className="w-3.5 h-3.5" />Add First Volunteer</button>}
            />
          </div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Volunteer</th><th>Specialization</th><th>Status</th><th>Tasks Done</th><th>Joined</th></tr></thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-cyan-glow border border-cyan/20 flex items-center justify-center text-[10px] font-black text-cyan shrink-0">
                        {initials(v.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary text-xs">{v.name}</p>
                        <p className="text-[10px] text-text-muted">{v.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{v.specialization || <span className="text-text-muted">—</span>}</td>
                  <td><Badge variant={STATUS_VARIANT[v.status] || 'neutral'} dot>{v.status}</Badge></td>
                  <td><span className="font-bold text-text-primary">{v.tasks_completed}</span></td>
                  <td>{formatDate(v.joined_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Volunteer" size="sm">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          {[
            { label: 'Full Name *', key: 'name', placeholder: 'Rahul Sharma', required: true },
            { label: 'Email Address *', key: 'email', placeholder: 'rahul@ngo.org', required: true },
            { label: 'Phone Number', key: 'phone', placeholder: '+91 98765 43210', required: false },
            { label: 'Specialization', key: 'specialization', placeholder: 'Nutrition & Health', required: false },
          ].map(field => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{field.label}</label>
              <input
                className="glass-input text-sm"
                placeholder={field.placeholder}
                required={field.required}
                value={(form as any)[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
              />
            </div>
          ))}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-ghost text-xs px-4 py-2">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-xs px-5 py-2">{saving && <Spinner size="xs" />}Add Volunteer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
