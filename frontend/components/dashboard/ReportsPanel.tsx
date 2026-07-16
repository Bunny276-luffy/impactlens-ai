'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileText, BarChart2, Users } from 'lucide-react';

interface ReportCard {
  id: string; title: string; description: string;
  icon: React.ComponentType<{ className?: string }>; color: string; bg: string;
}

const REPORTS: ReportCard[] = [
  { id: 'beneficiary', title: 'Beneficiary Growth Report', description: 'Comprehensive PDF with all beneficiary biometric progress, nutrition curves, and attendance trends', icon: Users, color: 'text-violet', bg: 'bg-violet-dim border-violet/20' },
  { id: 'donations', title: 'Donation Impact Report', description: 'Transparent breakdown of all donations, deployment categories, and measurable impact outcomes for donors', icon: BarChart2, color: 'text-mint', bg: 'bg-mint-dim border-mint/20' },
  { id: 'field', title: 'Field Activity Summary', description: 'Chronological log of all volunteer activities, evidence files, and verification statuses', icon: FileText, color: 'text-cyan', bg: 'bg-cyan-glow border-cyan/20' },
  { id: 'ai', title: 'AI Prediction Report', description: 'Risk assessment rankings, intervention recommendations, and model confidence scores across all beneficiaries', icon: FileSpreadsheet, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
];

export default function ReportsPanel() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = async (id: string) => {
    setGenerating(id);
    await new Promise(r => setTimeout(r, 1500));
    setGenerating(null);
    // TODO: Replace with actual PDF generation using Supabase data
    alert('PDF generation requires Supabase integration. This will download a real report once the database is connected.');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Reports & Export</h2>
          <p className="panel-subtitle">Generate and export high-fidelity PDF reports for stakeholders and donors</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {REPORTS.map(r => {
            const Icon = r.icon;
            const isGen = generating === r.id;
            return (
              <div key={r.id} className="glass-card rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center border ${r.bg}`}>
                    <Icon className={`w-5 h-5 ${r.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">{r.title}</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{r.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGenerate(r.id)}
                    disabled={!!generating}
                    className="flex-1 py-2 rounded-xl border border-border-default bg-white/[0.03]
                      hover:bg-white/[0.06] text-text-secondary hover:text-text-primary
                      text-xs font-semibold transition-all flex items-center justify-center gap-1.5
                      disabled:opacity-50"
                  >
                    {isGen ? (
                      <>
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Generate PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 rounded-2xl border border-border-subtle bg-white/[0.01]">
          <h3 className="text-xs font-bold text-text-primary mb-2">Export Formats</h3>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Reports are generated as print-ready PDFs with your organization's branding. CSV exports are also available for data analysts. Full report generation requires an active Supabase database connection with beneficiary and donation data.
          </p>
        </div>
      </div>
    </div>
  );
}
