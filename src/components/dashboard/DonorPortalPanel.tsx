'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/contexts/ToastContext';
import { formatDate } from '@/lib/utils';
import { 
  Building2, 
  Heart, 
  History, 
  Timeline, 
  Check, 
  ChevronRight, 
  X,
  CreditCard,
  TrendingUp,
  Award
} from 'lucide-react';

export default function DonorPortalPanel() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [ngos, setNgos] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<'ngos' | 'sponsor' | 'history' | 'timeline'>('ngos');

  // Donation Modal state
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState<any>(null);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  
  // Form states
  const [donationAmount, setDonationAmount] = useState('100');
  const [donationUsage, setDonationUsage] = useState('Food');
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ngoRes = await fetch('/api/analytics'); // Mock list loader
      const childRes = await fetch('/api/child');
      const donRes = await fetch('/api/donations');
      
      if (childRes.ok && donRes.ok) {
        const cData = await childRes.json();
        const dData = await donRes.json();
        setChildren(cData.filter((c: any) => (c.aiReports?.[0]?.priorityRanking ?? 5) <= 3)); // prioritize P1-P3
        setDonations(dData);
      }
      
      // Standard static NGO mapping for browsing
      setNgos([
        { id: 'ngo_1', name: 'Care & Share Education', mission: 'Providing quality education and basic amenities to street children.', contact: 'ngo@impactlens.ai', location: 'Delhi, India' },
        { id: 'ngo_2', name: 'Nutrition First', mission: 'Eradicating malnutrition in rural communities through structured food programs.', contact: 'nutrition@impactlens.ai', location: 'Mumbai, India' },
        { id: 'ngo_3', name: 'Global Hope Foundation', mission: 'Holistic child development focusing on literacy and medical aid.', contact: 'globalhope@impactlens.ai', location: 'Bangalore, India' }
      ]);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNGOModal = (ngo: any) => {
    setSelectedNGO(ngo);
    setSelectedChild(null);
    setDonationUsage('General');
    setShowDonationModal(true);
  };

  const openSponsorModal = (child: any) => {
    setSelectedChild(child);
    setSelectedNGO(null);
    setDonationUsage('Food'); // standard default child sponsorship usage
    setShowDonationModal(true);
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationAmount || Number(donationAmount) <= 0) {
      toast('Please enter a valid donation amount.', { type: 'warning' });
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        amount: Number(donationAmount),
        usage: donationUsage,
        donorId: 'donor_1', // Mock log mapped to seeded donor Arjun Malhotra
        ngoId: selectedChild ? selectedChild.ngoId : selectedNGO.id,
        childId: selectedChild ? selectedChild.id : undefined
      };

      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast(`Thank you! Your donation of $${donationAmount} has been processed successfully.`, {
          type: 'success',
          title: 'Donation Contributed'
        });
        setShowDonationModal(false);
        fetchData();
      } else {
        toast('Failed to process donation transaction.', { type: 'error' });
      }
    } catch (err) {
      console.error(err);
      toast('Error making donation.', { type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-xs text-gray-400 flex flex-col items-center gap-2 animate-pulse-subtle">
        <span className="h-6 w-6 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
        Syncing donor aggregates & portfolios...
      </div>
    );
  }

  // Pre-filter donor specific donations (seeded donor_1 is Arjun Malhotra)
  const myDonations = donations.filter((d: any) => d.donorId === 'donor_1');
  const totalMyDonated = myDonations.reduce((sum: number, d: any) => sum + d.amount, 0);

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      
      {/* Top Profile Summary Strip */}
      <div className="p-5 rounded-2xl glass-panel text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-brand-purple/10 bg-brand-purple/5">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold text-white">Donor Portfolio Dashboard</h2>
          <p className="text-xs text-gray-400">Manage sponsored child profiles and download historical receipts.</p>
        </div>

        <div className="flex gap-6 text-xs font-mono">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-sans">Total Sponsored</span>
            <span className="text-white font-bold text-sm">${totalMyDonated.toLocaleString()} USD</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-sans">Active Sponsorings</span>
            <span className="text-white font-bold text-sm">{myDonations.filter(d => d.childId).length} Children</span>
          </div>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex gap-2 border-b border-white/5 pb-2 text-xs">
        <button 
          onClick={() => setSubTab('ngos')}
          className={`px-4 py-1.5 font-bold rounded-lg transition-all ${subTab === 'ngos' ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Browse NGOs
        </button>
        <button 
          onClick={() => setSubTab('sponsor')}
          className={`px-4 py-1.5 font-bold rounded-lg transition-all ${subTab === 'sponsor' ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Sponsor Flagged Children
        </button>
        <button 
          onClick={() => setSubTab('history')}
          className={`px-4 py-1.5 font-bold rounded-lg transition-all ${subTab === 'history' ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Donation Ledger ({myDonations.length})
        </button>
        <button 
          onClick={() => setSubTab('timeline')}
          className={`px-4 py-1.5 font-bold rounded-lg transition-all ${subTab === 'timeline' ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Impact Updates Timeline
        </button>
      </div>

      {/* SUB TAB VIEWS */}
      
      {/* 1. BROWSE NGOS */}
      {subTab === 'ngos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {ngos.map(ngo => (
            <div key={ngo.id} className="p-5 rounded-2xl glass-card flex flex-col gap-4">
              <div className="h-10 w-10 rounded-lg bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20 text-brand-purple">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{ngo.name}</h3>
                <span className="text-[10px] text-brand-purple/80 uppercase font-semibold">{ngo.location}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed min-h-[48px]">{ngo.mission}</p>
              
              <button
                onClick={() => openNGOModal(ngo)}
                className="w-full py-2 bg-brand-purple/10 border border-brand-purple/20 hover:bg-brand-purple/20 text-brand-purple rounded-lg text-xs font-bold transition-all mt-auto"
              >
                Contribute Fund
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 2. SPONSOR FLAG-CHILDREN */}
      {subTab === 'sponsor' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {children.length === 0 ? (
            <p className="text-xs text-gray-500 sm:col-span-3 text-center py-6">No highly flagged children listed currently. Excellent status!</p>
          ) : (
            children.map(child => {
              const ai = child.aiReports?.[0] || {};
              const health = child.healthRecords?.[0] || {};
              const edu = child.educationRecords?.[0] || {};
              return (
                <div key={child.id} className="p-5 rounded-2xl glass-card flex flex-col gap-4 border border-amber-500/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-white">{child.name}</h3>
                      <span className="text-[10px] text-gray-400">{child.age} yrs / {child.gender}</span>
                    </div>
                    {ai.priorityRanking === 1 ? (
                      <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[8px] uppercase">Urgent Aid</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[8px] uppercase">Priority 2</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-white/1 p-2.5 rounded-lg border border-white/5">
                    <div>Nutrition: <span className="font-bold text-white">{health.nutritionScore}%</span></div>
                    <div>Attendance: <span className="font-bold text-white">{edu.attendanceRate}%</span></div>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-normal line-clamp-2">
                    **AI Suggestion**: {ai.suggestedIntervention}
                  </p>

                  <button
                    onClick={() => openSponsorModal(child)}
                    className="w-full py-2 bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-auto shadow"
                  >
                    <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                    Sponsor this Child
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 3. DONATION LEDGER HISTORY */}
      {subTab === 'history' && (
        <div className="rounded-xl border border-white/8 bg-bg-darker/60 overflow-hidden shadow-xl text-left">
          {myDonations.length === 0 ? (
            <p className="p-8 text-center text-xs text-gray-500">No transactions recorded yet.</p>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/1 text-gray-400 uppercase font-bold tracking-wider">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Allocation Target</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Sponsored Child</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {myDonations.map((don) => (
                  <tr key={don.id} className="hover:bg-white/1 transition-colors">
                    <td className="p-4 font-mono text-gray-400">{don.id}</td>
                    <td className="p-4 text-gray-300">{formatDate(don.date)}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple text-[10px] font-semibold">
                        {don.usage}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">${don.amount} USD</td>
                    <td className="p-4 text-gray-300 font-bold">{don.child?.name || 'General School Fund'}</td>
                    <td className="p-4 text-right text-emerald-400 font-bold">Processed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 4. IMPACT TIMELINE UPDATES */}
      {subTab === 'timeline' && (
        <div className="rounded-2xl glass-panel p-6 text-left max-w-2xl mx-auto flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-bold text-white">Sponsored Child Developmental Timeline</h3>
            <p className="text-[10px] text-gray-500">Chronological list of clinical updates and school registrations logged by field workers.</p>
          </div>

          <div className="relative border-l border-white/8 pl-6 ml-2 flex flex-col gap-8 text-xs">
            {/* Timeline item 1 */}
            <div className="relative">
              <div className="absolute -left-[30px] top-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-bg-dark flex items-center justify-center shadow" />
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">June 28, 2026</span>
                <h4 className="font-bold text-white">Biometrics Update: Riya Gupta</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Volunteer **Sarah Jenkins** audited Riya Gupta. Height increased to 105cm, weight stabilized to 13.2kg. Nutrition score updated from 48 to 52.
                </p>
              </div>
            </div>

            {/* Timeline item 2 */}
            <div className="relative">
              <div className="absolute -left-[30px] top-0.5 h-3.5 w-3.5 rounded-full bg-brand-purple border-2 border-bg-dark flex items-center justify-center shadow" />
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">June 25, 2026</span>
                <h4 className="font-bold text-white">Child Sponsorship Linked: Rahul Kumar</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Donor **Arjun Malhotra** contributed $250 allocated specifically for Rahul Kumar's weekly high-protein mid-day diet supplement.
                </p>
              </div>
            </div>

            {/* Timeline item 3 */}
            <div className="relative">
              <div className="absolute -left-[30px] top-0.5 h-3.5 w-3.5 rounded-full bg-amber-400 border-2 border-bg-dark flex items-center justify-center shadow animate-pulse" />
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">June 25, 2026</span>
                <h4 className="font-bold text-red-400 flex items-center gap-1.5">Emergency Malnutrition Alert Flagged</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  AI diagnostic algorithm flagged **Rahul Kumar** at Priority level 3. Weight-for-age metrics indicates nutritional deficit. Interventions suggestions deployed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DONATION DIALOG MODAL */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-bg-panel border border-white/8 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-sm font-bold text-white">
                {selectedChild ? `Sponsor Child: ${selectedChild.name}` : `Fund NGO: ${selectedNGO?.name}`}
              </h3>
              <button onClick={() => setShowDonationModal(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleDonationSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Contribution Amount ($ USD)</label>
                <div className="grid grid-cols-4 gap-2">
                  {['50', '100', '250', '500'].map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setDonationAmount(val)}
                      className={`py-1.5 rounded-lg border text-center text-xs font-bold transition-all ${
                        donationAmount === val 
                          ? 'bg-brand-purple/10 border-brand-purple text-white' 
                          : 'border-white/5 bg-white/2 hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
                <input 
                  type="number"
                  required
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="glass-input px-3 py-2 text-xs mt-2" 
                  placeholder="Or enter custom amount..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Allocation Target Tag</label>
                <select 
                  value={donationUsage}
                  onChange={(e) => setDonationUsage(e.target.value)}
                  className="glass-input px-3 py-2 text-xs text-white"
                >
                  <option value="Food">Food & Mid-Day Meal Supplements</option>
                  <option value="Education">Books, School Uniforms, & Writing Kits</option>
                  <option value="Health">Medical Checkups & Emergency Growth Kits</option>
                  <option value="General">General Administrative Operations Support</option>
                </select>
              </div>

              {selectedChild && (
                <div className="p-3 rounded bg-white/2 border border-white/5 text-[10px] text-gray-400 leading-normal">
                  📌 **Direct Mapping**: This donation will be linked to **{selectedChild.name}** (NGO: {selectedChild.ngo?.name}). Biometric growth logs will be updated directly to your Impact timeline.
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue font-bold text-xs text-white hover:opacity-95 shadow-lg flex items-center justify-center gap-1.5 mt-2 disabled:opacity-50"
              >
                {processing ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Complete Contribution
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
