'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { formatDate } from '@/lib/utils';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckSquare, 
  Square,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Building2,
  Users,
  Activity,
  Award
} from 'lucide-react';

export default function ReportsPanel() {
  const { toast } = useToast();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<'child' | 'ngo' | 'donations'>('child');
  const [selectedChildId, setSelectedChildId] = useState('');
  
  // Custom checklist configurations
  const [includeHealthCheckpoints, setIncludeHealth] = useState(true);
  const [includeEducationMetrics, setIncludeEducation] = useState(true);
  const [includeAIEstimates, setIncludeAI] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [printPreview, setPrintPreview] = useState(false);
  const [currentDate, setCurrentDate] = useState('2026-06-29');

  useEffect(() => {
    setCurrentDate(formatDate(new Date()));
  }, []);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await fetch('/api/child');
        if (res.ok) {
          const data = await res.json();
          setChildren(data);
          if (data.length > 0) {
            setSelectedChildId(data[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  const triggerExport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast('Your PDF Report has been generated and downloaded.', {
        type: 'success',
        title: 'Report Downloaded'
      });
      // Trigger native browser printing
      window.print();
    }, 1500);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-xs text-gray-400 flex flex-col items-center gap-2 animate-pulse-subtle">
        <span className="h-6 w-6 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
        Loading reporting configurations...
      </div>
    );
  }

  const selectedChildObj = children.find(c => c.id === selectedChildId);
  const latestHealth = selectedChildObj?.healthRecords?.[0] || {};
  const latestEdu = selectedChildObj?.educationRecords?.[0] || {};
  const latestAI = selectedChildObj?.aiReports?.[0] || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[calc(100vh-4rem)] text-left print:bg-white print:text-black print:p-0 print:m-0">
      
      {/* Configuration column (hide on print) */}
      <div className="md:col-span-1 rounded-2xl glass-panel p-5 flex flex-col gap-5 h-fit print:hidden">
        <div>
          <h3 className="text-sm font-bold text-white">Generate Analytical Reports</h3>
          <p className="text-[10px] text-gray-500">Configure layout scopes for printable exports.</p>
        </div>

        {/* Option Selectors */}
        <div className="flex flex-col gap-2">
          {[
            { id: 'child', label: 'Child Growth Progress Report', desc: 'Longitudinal biometric records & AI predictions.' },
            { id: 'ngo', label: 'NGO Node Performance Summary', desc: 'Aggregates of child metrics, alerts, and node stability.' },
            { id: 'donations', label: 'Donation Allocation Ledger', desc: 'History logs of funds distribution checkpoints.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setReportType(opt.id as any)}
              className={`p-3 rounded-xl border text-left transition-all ${
                reportType === opt.id 
                  ? 'bg-brand-purple/10 border-brand-purple/40 font-bold' 
                  : 'bg-white/2 border-white/5 text-gray-400 hover:bg-white/4 hover:text-white'
              }`}
            >
              <span className="text-xs text-white block">{opt.label}</span>
              <span className="text-[9px] text-gray-500 font-normal leading-relaxed mt-1 block">{opt.desc}</span>
            </button>
          ))}
        </div>

        <hr className="border-white/5" />

        {/* Custom filters for Child Report */}
        {reportType === 'child' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Select Child Profile</label>
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full glass-input px-3 py-2 text-xs text-white"
              >
                {children.map(c => <option key={c.id} value={c.id} className="bg-bg-panel">{c.name} (Age {c.age})</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2 text-xs text-gray-300 pt-2">
              <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">Report Layout Options</span>
              
              <button 
                onClick={() => setIncludeHealth(!includeHealthCheckpoints)}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                {includeHealthCheckpoints ? <CheckSquare className="w-4 h-4 text-brand-purple" /> : <Square className="w-4 h-4 text-gray-600" />}
                <span>Include biometric history</span>
              </button>

              <button 
                onClick={() => setIncludeEducation(!includeEducationMetrics)}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                {includeEducationMetrics ? <CheckSquare className="w-4 h-4 text-brand-purple" /> : <Square className="w-4 h-4 text-gray-600" />}
                <span>Include attendance history</span>
              </button>

              <button 
                onClick={() => setIncludeAI(!includeAIEstimates)}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                {includeAIEstimates ? <CheckSquare className="w-4 h-4 text-brand-purple" /> : <Square className="w-4 h-4 text-gray-600" />}
                <span>Include AI summary & priority actions</span>
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={triggerExport}
            disabled={generating}
            className="w-full py-2.5 bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow"
          >
            {generating ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate & Export PDF
              </>
            )}
          </button>
        </div>

      </div>

      {/* Report Preview panel */}
      <div className="md:col-span-2 rounded-2xl glass-panel p-6 bg-white text-black border border-white/10 flex flex-col gap-6 font-serif shadow-2xl relative print:border-none print:shadow-none print:p-0">
        
        {/* Print only banner overlay */}
        <div className="absolute top-4 right-6 text-gray-400 font-sans text-[10px] flex items-center gap-2 print:hidden select-none">
          <Printer className="w-3.5 h-3.5" />
          <span>Layout Print Preview</span>
        </div>

        {/* 1. CHILD REPORT PREVIEW */}
        {reportType === 'child' && selectedChildObj && (
          <div className="flex flex-col gap-6 text-left">
            {/* Report Header */}
            <div className="border-b-2 border-gray-300 pb-4 flex justify-between items-start font-sans">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">IMPACTLENS AI PROGRESS PORTRAIT</h1>
                <p className="text-[10px] text-gray-500">System generated biometric audit documentation. Recalculated: {currentDate}</p>
              </div>
              <div className="text-right text-[10px] text-gray-600">
                <span className="font-bold text-gray-900 block">Care & Share School Node #12</span>
                <span>NGO Partner License: #NGO-827-01</span>
              </div>
            </div>

            {/* Child Profile Info Grid */}
            <div className="grid grid-cols-2 gap-4 font-sans text-xs border-b border-gray-200 pb-4">
              <div className="flex flex-col gap-1.5">
                <div><span className="text-gray-500 uppercase font-bold text-[9px]">Child's Name:</span> <span className="font-bold text-gray-900">{selectedChildObj.name}</span></div>
                <div><span className="text-gray-500 uppercase font-bold text-[9px]">Age / Gender:</span> <span className="text-gray-900">{selectedChildObj.age} Years old / {selectedChildObj.gender}</span></div>
                <div><span className="text-gray-500 uppercase font-bold text-[9px]">School Enrolled:</span> <span className="text-gray-900">{selectedChildObj.school}</span></div>
              </div>
              <div className="flex flex-col gap-1.5 border-l border-gray-200 pl-4">
                <div><span className="text-gray-500 uppercase font-bold text-[9px]">Guardian Details:</span> <span className="text-gray-900">{selectedChildObj.guardianName || 'N/A'} ({selectedChildObj.guardianRelationship || 'N/A'})</span></div>
                <div><span className="text-gray-500 uppercase font-bold text-[9px]">Guardian Phone:</span> <span className="text-gray-900 font-mono">{selectedChildObj.guardianPhone || 'N/A'}</span></div>
                <div><span className="text-gray-500 uppercase font-bold text-[9px]">Assigned NGO:</span> <span className="text-gray-900 font-bold">{selectedChildObj.ngo?.name || 'Care & Share'}</span></div>
              </div>
            </div>

            {/* AI Diagnostics details block */}
            {includeAIEstimates && latestAI.id && (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-left flex flex-col gap-2 font-sans">
                <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">AI DIAGNOSTIC SNAPSHOT</span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[8px] uppercase">Priority {latestAI.priorityRanking}</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1 text-gray-900">
                  <span className="text-2xl font-extrabold">{latestAI.riskScore}%</span>
                  <span className="text-[9px] text-gray-500">Overall developmental risk score</span>
                </div>
                <p className="text-[11px] text-gray-700 leading-relaxed italic pt-1">
                  "**Summary**: {latestAI.aiSummary}"
                </p>
                <div className="text-[10px] text-gray-800 font-bold bg-white p-2.5 rounded border border-gray-200 mt-1 leading-relaxed">
                  📢 **Suggested Intervention**: {latestAI.suggestedIntervention}
                </div>
              </div>
            )}

            {/* Health Biometric History table */}
            {includeHealthCheckpoints && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100 pb-1">Biometric Audit Checkpoints History</h4>
                <table className="w-full text-left font-sans text-[10px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 text-gray-500 font-bold uppercase">
                      <th className="py-2">Audit Checkpoint Date</th>
                      <th className="py-2">Height (cm)</th>
                      <th className="py-2">Weight (kg)</th>
                      <th className="py-2">BMI Status</th>
                      <th className="py-2 text-right">Nutrition Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    {selectedChildObj.healthRecords?.map((h: any, i: number) => (
                      <tr key={h.id}>
                        <td className="py-2 text-gray-500">{formatDate(h.date)}</td>
                        <td className="py-2">{h.height} cm</td>
                        <td className="py-2">{h.weight} kg</td>
                        <td className="py-2">{h.bmi}</td>
                        <td className="py-2 text-right font-bold text-gray-900">{h.nutritionScore} / 100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Education attendance progress checkpoint */}
            {includeEducationMetrics && (
              <div className="flex flex-col gap-2 mt-2">
                <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100 pb-1">Academic Registry History</h4>
                <table className="w-full text-left font-sans text-[10px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 text-gray-500 font-bold uppercase">
                      <th className="py-2">Audit Date</th>
                      <th className="py-2">Registry Attendance</th>
                      <th className="py-2">Learning Progress Profile</th>
                      <th className="py-2 text-right">Identified Talents / Skills</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    {selectedChildObj.educationRecords?.map((e: any) => (
                      <tr key={e.id}>
                        <td className="py-2 text-gray-500">{formatDate(e.date)}</td>
                        <td className="py-2 font-bold text-gray-900">{e.attendanceRate}%</td>
                        <td className="py-2">{e.learningProgress}</td>
                        <td className="py-2 text-right">{e.talentIdentification || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Signature Block */}
            <div className="grid grid-cols-2 gap-8 font-sans text-[10px] text-gray-600 mt-8 pt-10 border-t border-gray-200">
              <div className="flex flex-col gap-1.5">
                <div className="h-6 border-b border-gray-400 w-3/4" />
                <span>Signature of NGO Node Coordinator</span>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <div className="h-6 border-b border-gray-400 w-3/4" />
                <span>Field Volunteer Verification Stamp</span>
              </div>
            </div>

          </div>
        )}

        {/* 2. NGO REPORT PREVIEW */}
        {reportType === 'ngo' && (
          <div className="flex flex-col gap-6 text-left">
            <div className="border-b-2 border-gray-300 pb-4 flex justify-between items-start font-sans">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">NGO NODE PERFORMANCE REPORT</h1>
                <p className="text-[10px] text-gray-500">Summary reports compiled on system telemetry: {currentDate}</p>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-sans">Global NGO Alliance</span>
            </div>

            <div className="grid grid-cols-3 gap-4 font-sans text-xs text-center border-b border-gray-200 pb-4 text-gray-800">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 uppercase font-bold text-[8px] block">Children Audited</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">10 Children</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 uppercase font-bold text-[8px] block">Nutrition Index</span>
                <span className="text-xl font-bold text-gray-900 mt-1 block">70.2 / 100</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 uppercase font-bold text-[8px] block">Active Alerts</span>
                <span className="text-xl font-bold text-red-600 mt-1 block">2 Emergency P1</span>
              </div>
            </div>

            {/* List of NGOs */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-gray-600">NGO Partner Center performance index</h4>
              <div className="flex flex-col gap-3 font-sans text-[11px] text-gray-700">
                <div className="p-3 bg-gray-50/50 border border-gray-200 rounded-lg flex justify-between">
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs">Care & Share Education</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">Assigned Volunteers: Sarah Jenkins | Total Children: 7</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">92.4% Stability Rating</span>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Average Attendance: 88.5%</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50/50 border border-gray-200 rounded-lg flex justify-between">
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs">Nutrition First</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">Assigned Volunteers: None | Total Children: 2</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">94.8% Stability Rating</span>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Average Attendance: 92.0%</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50/50 border border-gray-200 rounded-lg flex justify-between">
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs">Global Hope Foundation</h5>
                    <p className="text-[10px] text-gray-500 mt-0.5">Assigned Volunteers: None | Total Children: 1</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-yellow-600">82.0% Stability Rating</span>
                    <span className="text-[9px] text-gray-500 block mt-0.5">Average Attendance: 82.0%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="font-sans text-[10px] text-gray-600 border-t border-gray-200 pt-6 mt-12 flex justify-between">
              <span>ImpactLens Audit Node #12</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        )}

        {/* 3. DONATION LEDGER PREVIEW */}
        {reportType === 'donations' && (
          <div className="flex flex-col gap-6 text-left">
            <div className="border-b-2 border-gray-300 pb-4 flex justify-between items-start font-sans">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">DONATION LEDGER EXPORT</h1>
                <p className="text-[10px] text-gray-500">History report generated on: {currentDate}</p>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-sans">Audit Verification System</span>
            </div>

            {/* List of Donations */}
            <div className="flex flex-col gap-2 font-sans">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Funding Allocations History</h4>
              
              <table className="w-full text-left text-[10px] border-collapse mt-2">
                <thead>
                  <tr className="border-b border-gray-300 text-gray-500 font-bold uppercase">
                    <th className="py-2">Date</th>
                    <th className="py-2">Donor</th>
                    <th className="py-2">NGO Target</th>
                    <th className="py-2">Category</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  <tr>
                    <td className="py-2 text-gray-500 font-mono">2026-06-25</td>
                    <td className="py-2 font-bold text-gray-900">Arjun Malhotra</td>
                    <td className="py-2">Global Hope Foundation</td>
                    <td className="py-2">Health</td>
                    <td className="py-2 text-right font-bold text-gray-900">$1,100.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500 font-mono">2026-06-20</td>
                    <td className="py-2 font-bold text-gray-900">Arjun Malhotra</td>
                    <td className="py-2">Care & Share Education</td>
                    <td className="py-2">Education</td>
                    <td className="py-2 text-right font-bold text-gray-900">$12,000.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500 font-mono">2026-06-15</td>
                    <td className="py-2 font-bold text-gray-900">Arjun Malhotra</td>
                    <td className="py-2">Care & Share Education</td>
                    <td className="py-2">Food</td>
                    <td className="py-2 text-right font-bold text-gray-900">$300.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-500 font-mono">2026-06-12</td>
                    <td className="py-2 font-bold text-gray-900">Arjun Malhotra</td>
                    <td className="py-2">Nutrition First</td>
                    <td className="py-2">General</td>
                    <td className="py-2 text-right font-bold text-gray-900">$1,000.00</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 mt-6 flex justify-between items-center text-xs">
                <span className="text-gray-600 font-bold uppercase text-[9px]">Aggregate Audited Contributions</span>
                <span className="text-lg font-extrabold text-gray-900">$14,400.00 USD</span>
              </div>
            </div>

            <div className="font-sans text-[10px] text-gray-600 border-t border-gray-200 pt-6 mt-12 flex justify-between">
              <span>ImpactLens Audit verification certificate</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
