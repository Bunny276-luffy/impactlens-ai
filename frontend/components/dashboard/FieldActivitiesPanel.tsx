'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Plus, Search, Camera, MapPin, Calendar } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { apiFetch } from '@/hooks/useApi';
import { useToast } from '@/contexts/ToastContext';
import { formatDate } from '@/utils/format';

interface FieldActivity {
  id: string; title: string; description: string | null;
  activity_date: string; location: string | null;
  impact_score: number | null; status: string;
  evidence_urls: string[]; created_at: string;
}

const STATUS_VARIANT: Record<string, any> = {
  'Pending Verification': 'warning', 'Verified': 'success', 'Flagged': 'critical',
};

export default function FieldActivitiesPanel() {
  const { toast } = useToast();
  const [activities, setActivities] = useState<FieldActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', activity_date: '', location: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/activities');
      if (res.ok) {
        const data = await res.json();
        setActivities(data.data?.data || []);
      }
    } catch { toast('Failed to load activities', { type: 'error' }); }
    finally { setLoading(false); }
  };

  const filtered = activities.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.activity_date) { toast('Title and date required', { type: 'warning' }); return; }
    setSaving(true);
    try {
      const res = await apiFetch('/api/activities', {
        method: 'POST',
        body: JSON.stringify({ ...form, ngo_id: 'placeholder', volunteer_id: 'placeholder' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast('Activity logged', { type: 'success', title: 'Logged' });
      setAddOpen(false);
      fetchActivities();
    } catch (err: any) {
      toast(err.message, { type: 'error' });
    } finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Field Activities</h2>
          <p className="panel-subtitle">Log and verify all volunteer field activities and evidence</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary text-xs px-4 py-2">
          <Plus className="w-3.5 h-3.5" /> Log Activity
        </button>
      </div>

      <div className="px-6 py-4 border-b border-border-subtle flex items-center gap-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-text-muted" />
          <input className="glass-input pl-9 text-xs h-9" placeholder="Search activities…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="text-xs text-text-muted ml-auto">{filtered.length} records</span>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-48"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No field activities logged"
            description="Volunteers log activities here after completing field visits, biometric checks, and educational sessions"
            size="lg"
            action={<button onClick={() => setAddOpen(true)} className="btn-primary text-xs px-5 py-2.5"><Plus className="w-3.5 h-3.5" />Log First Activity</button>}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(a => (
              <div key={a.id} className="glass-card rounded-2xl p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-cyan-glow border border-cyan/20 flex items-center justify-center shrink-0">
                  <Camera className="w-4.5 h-4.5 text-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">{a.title}</h3>
                      {a.description && <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{a.description}</p>}
                    </div>
                    <Badge variant={STATUS_VARIANT[a.status] || 'neutral'}>{a.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                      <Calendar className="w-3 h-3" /> {formatDate(a.activity_date)}
                    </div>
                    {a.location && (
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <MapPin className="w-3 h-3" /> {a.location}
                      </div>
                    )}
                    {a.impact_score !== null && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="text-text-muted">Impact Score:</span>
                        <span className="font-bold text-mint">{a.impact_score}/100</span>
                      </div>
                    )}
                    {a.evidence_urls.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                        <Camera className="w-3 h-3" /> {a.evidence_urls.length} evidence files
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Log Field Activity" size="md">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Activity Title *</label>
            <input className="glass-input text-sm" required placeholder="Weekly nutrition check — Lajpat Nagar" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Description</label>
            <textarea rows={3} className="glass-input text-sm resize-none" placeholder="Describe what happened during this field activity…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Activity Date *</label>
              <input type="date" required className="glass-input text-sm" value={form.activity_date} onChange={e => setForm(f => ({ ...f, activity_date: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Location</label>
              <input className="glass-input text-sm" placeholder="Lajpat Nagar Center" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-ghost text-xs px-4 py-2">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary text-xs px-5 py-2">{saving && <Spinner size="xs" />}Log Activity</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
