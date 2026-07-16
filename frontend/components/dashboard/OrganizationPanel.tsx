'use client';

import React, { useState } from 'react';
import { Building2, Globe, Mail, Phone, MapPin, Save, Edit2 } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/contexts/ToastContext';
import { apiFetch } from '@/hooks/useApi';

interface OrgForm {
  name: string; description: string; website: string;
  contact_email: string; contact_phone: string; address: string; city: string; country: string;
}

const INITIAL: OrgForm = { name: '', description: '', website: '', contact_email: '', contact_phone: '', address: '', city: '', country: '' };

export default function OrganizationPanel() {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<OrgForm>(INITIAL);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch('/api/ngo', {
        method: 'PUT',
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast('Organization profile updated', { type: 'success', title: 'Saved' });
        setEditing(false);
      } else {
        toast('Failed to update organization profile', { type: 'error' });
      }
    } catch {
      toast('Failed to update organization profile', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof OrgForm, placeholder: string, icon: React.ReactNode, type = 'text') => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-2.5 text-text-muted">{icon}</div>
        <input
          type={type}
          disabled={!editing}
          className={`glass-input pl-10 text-sm ${!editing ? 'opacity-60 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Organization Settings</h2>
          <p className="panel-subtitle">Manage your NGO's public profile and contact information</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-ghost text-xs px-4 py-2 flex items-center gap-1.5">
            <Edit2 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => setEditing(false)} className="btn-ghost text-xs px-3 py-2">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-xs px-4 py-2">
              {saving ? <Spinner size="xs" /> : <Save className="w-3.5 h-3.5" />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Logo placeholder */}
        <div className="glass-card rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-cyan-violet flex items-center justify-center shrink-0">
            <Building2 className="w-8 h-8 text-obsidian-deep" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">{form.name || 'Your Organization Name'}</h3>
            <p className="text-xs text-text-muted mt-1">{form.city || 'City'}{form.country ? `, ${form.country}` : ''}</p>
            {editing && (
              <button className="mt-2 text-[10px] text-cyan font-bold hover:underline">Upload Logo</button>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('Organization Name', 'name', 'Hope Foundation', <Building2 className="w-3.5 h-3.5" />)}
              {field('Website', 'website', 'https://hopefoundation.org', <Globe className="w-3.5 h-3.5" />)}
            </div>
            <div className="mt-4">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Description</label>
              <textarea
                disabled={!editing}
                rows={3}
                className={`glass-input mt-1.5 text-sm resize-none w-full ${!editing ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="Describe your organization's mission and impact areas…"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('Contact Email', 'contact_email', 'hello@ngo.org', <Mail className="w-3.5 h-3.5" />, 'email')}
              {field('Contact Phone', 'contact_phone', '+91 98765 43210', <Phone className="w-3.5 h-3.5" />)}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">{field('Street Address', 'address', '42 NGO Street, Sector 7', <MapPin className="w-3.5 h-3.5" />)}</div>
              {field('City', 'city', 'New Delhi', <MapPin className="w-3.5 h-3.5" />)}
            </div>
            <div className="mt-4 max-w-xs">
              {field('Country', 'country', 'India', <Globe className="w-3.5 h-3.5" />)}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
