'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { 
  CalendarCheck, 
  Plus, 
  Check, 
  Camera, 
  FileText, 
  ChevronRight, 
  Activity, 
  Bookmark,
  Sparkles,
  UploadCloud,
  FileCheck
} from 'lucide-react';

export default function VolunteerPortalPanel() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'log-visit'>('tasks');

  // Audit Form States
  const [selectedChildId, setSelectedChildId] = useState('');
  const [height, setHeight] = useState('120');
  const [weight, setWeight] = useState('22');
  const [nutritionScore, setNutritionScore] = useState('75');
  const [attendanceRate, setAttendanceRate] = useState('90');
  const [learningProgress, setLearningProgress] = useState('Average');
  const [skills, setSkills] = useState('None');
  const [healthNotes, setHealthNotes] = useState('');
  
  // Image mock upload
  const [photoSelected, setPhotoSelected] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const taskRes = await fetch('/api/volunteer/tasks');
      const childRes = await fetch('/api/child');
      if (taskRes.ok && childRes.ok) {
        const tData = await taskRes.json();
        const cData = await childRes.json();
        setTasks(tData);
        setChildren(cData);
        if (cData.length > 0) {
          setSelectedChildId(cData[0].id);
          // Set initial form metrics based on current latest record
          fillFormWithChildData(cData[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fillFormWithChildData = (child: any) => {
    const latestHealth = child.healthRecords?.[0] || {};
    const latestEdu = child.educationRecords?.[0] || {};
    setHeight(String(latestHealth.height ?? 120));
    setWeight(String(latestHealth.weight ?? 22));
    setNutritionScore(String(latestHealth.nutritionScore ?? 75));
    setAttendanceRate(String(latestEdu.attendanceRate ?? 90));
    setLearningProgress(latestEdu.learningProgress ?? 'Average');
    setSkills(latestEdu.talentIdentification ?? 'None');
    setHealthNotes(latestHealth.healthReport ?? '');
  };

  const handleChildSelectChange = (id: string) => {
    setSelectedChildId(id);
    const child = children.find(c => c.id === id);
    if (child) {
      fillFormWithChildData(child);
    }
  };

  const markTaskCompleted = async (taskId: string) => {
    try {
      const res = await fetch(`/api/volunteer/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      if (res.ok) {
        toast('Task checklist item marked completed.', { type: 'success', title: 'Task Completed' });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) {
      toast('Please select a child profile first.', { type: 'warning' });
      return;
    }

    setSubmitting(true);
    // Simulate biometric analysis delay
    setTimeout(async () => {
      try {
        const payload = {
          height: Number(height),
          weight: Number(weight),
          nutritionScore: Number(nutritionScore),
          attendanceRate: Number(attendanceRate),
          learningProgress,
          talentIdentification: skills,
          healthReport: healthNotes
        };

        const res = await fetch(`/api/child/${selectedChildId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          toast('Biometric check logged! AI risk scoring recalculated.', {
            type: 'success',
            title: 'Audit Log Committed'
          });
          
          // Clear notes & photo state
          setHealthNotes('');
          setPhotoSelected(false);
          setActiveTab('tasks');
          fetchData();
        } else {
          toast('Failed to record biometric check.', { type: 'error' });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-xs text-gray-400 flex flex-col items-center gap-2 animate-pulse-subtle">
        <span className="h-6 w-6 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
        Syncing volunteer task lists...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
      
      {/* Top Strip */}
      <div className="p-4 rounded-xl border border-brand-blue/20 bg-brand-blue/5 text-left flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-brand-blue/15 border border-brand-blue/30 text-brand-blue flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-sans">Sarah Jenkins: Field Coordinator</h2>
            <p className="text-[10px] text-gray-400 font-sans">Node Center Lajpat Nagar #12. Assigned task lists.</p>
          </div>
        </div>
        
        <div className="flex gap-2 text-xs">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-1.5 font-bold rounded-lg transition-all ${activeTab === 'tasks' ? 'bg-white/5 text-white border border-white/8' : 'text-gray-400 hover:text-white'}`}
          >
            Checklist Task Queue
          </button>
          <button 
            onClick={() => setActiveTab('log-visit')}
            className={`px-4 py-1.5 font-bold rounded-lg transition-all ${activeTab === 'log-visit' ? 'bg-white/5 text-white border border-white/8' : 'text-gray-400 hover:text-white'}`}
          >
            Audit Biometrics Log
          </button>
        </div>
      </div>

      {/* VIEW 1: TASK CHECKLISTS */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Pending Tasks list */}
          <div className="md:col-span-2 rounded-2xl glass-panel p-5 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Pending Operational Audits</h3>
              <p className="text-[10px] text-gray-500">Voluntary checklist targets to clear by weekly deadlines.</p>
            </div>

            <div className="flex flex-col gap-3">
              {tasks.filter(t => t.status === 'PENDING').length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">All operational tasks are cleared! Outstanding job.</p>
              ) : (
                tasks.filter(t => t.status === 'PENDING').map(t => (
                  <div key={t.id} className="p-4 rounded-xl bg-white/2 border border-white/5 flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xs font-bold text-white">{t.title}</h4>
                      <p className="text-[10px] text-gray-400 leading-normal">{t.description}</p>
                      <span className="text-[8px] text-brand-purple uppercase tracking-wider font-bold mt-1">Due: {t.dueDate}</span>
                    </div>

                    <button
                      onClick={() => markTaskCompleted(t.id)}
                      className="px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 hover:bg-brand-purple/20 text-brand-purple text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 shrink-0"
                    >
                      <Check className="w-3 h-3" />
                      Complete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed history */}
          <div className="rounded-2xl glass-panel p-5 flex flex-col gap-4 h-[350px]">
            <div>
              <h3 className="text-sm font-bold text-white">Audit Clearances History</h3>
              <p className="text-[10px] text-gray-500">Tasks logged as completed in the database.</p>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {tasks.filter(t => t.status === 'COMPLETED').map(t => (
                <div key={t.id} className="p-3 rounded-lg border border-emerald-500/10 bg-emerald-950/5 flex items-start gap-2.5 opacity-80">
                  <FileCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-[11px] font-bold text-white leading-snug line-clamp-1">{t.title}</h5>
                    <p className="text-[9px] text-gray-400">Marked complete on check</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: LOG VISIT BIOMETRIC FORM */}
      {activeTab === 'log-visit' && (
        <form onSubmit={handleAuditSubmit} className="glass-panel p-6 rounded-2xl max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border border-white/8 relative">
          
          <div className="sm:col-span-2 border-b border-white/5 pb-2">
            <h3 className="text-sm font-bold text-white">Biometric Checkpoint Audit Logger</h3>
            <p className="text-[10px] text-gray-500">Records logged here trigger live AI calculations and notification alerts.</p>
          </div>

          {/* Child Select */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Select Child Profile *</label>
            <select
              value={selectedChildId}
              onChange={(e) => handleChildSelectChange(e.target.value)}
              className="glass-input px-3 py-2.5 text-xs text-white"
            >
              {children.map(c => <option key={c.id} value={c.id} className="bg-bg-panel">{c.name} (Age {c.age})</option>)}
            </select>
          </div>

          {/* Biometrics */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Height (cm)</label>
            <input 
              type="number" 
              required
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="glass-input px-3 py-2.5 text-xs" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Weight (kg)</label>
            <input 
              type="number" 
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="glass-input px-3 py-2.5 text-xs" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Nutrition Score (0-100)</label>
            <input 
              type="number" 
              required
              value={nutritionScore}
              onChange={(e) => setNutritionScore(e.target.value)}
              className="glass-input px-3 py-2.5 text-xs" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Attendance registry (%)</label>
            <input 
              type="number" 
              required
              value={attendanceRate}
              onChange={(e) => setAttendanceRate(e.target.value)}
              className="glass-input px-3 py-2.5 text-xs" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Academic Absorption Rating</label>
            <select
              value={learningProgress}
              onChange={(e) => setLearningProgress(e.target.value)}
              className="glass-input px-3 py-2.5 text-xs text-white"
            >
              <option value="Excellent">Excellent</option>
              <option value="Average">Average</option>
              <option value="Needs Support">Needs Support</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Identified Talents Tag</label>
            <input 
              type="text" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="glass-input px-3 py-2.5 text-xs" 
            />
          </div>

          {/* Notes description */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Clinical Observations / Notes</label>
            <textarea
              rows={3}
              value={healthNotes}
              onChange={(e) => setHealthNotes(e.target.value)}
              className="glass-input px-3 py-2 text-xs resize-none"
              placeholder="e.g. Skin exhibits minor dry patches. Advised higher protein supplements..."
            />
          </div>

          {/* Drag and Drop Mock upload */}
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Biometric photo audit verification</label>
            <div 
              onClick={() => setPhotoSelected(true)}
              className={`p-6 border border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-white/2 transition-all ${
                photoSelected ? 'border-brand-blue/50 bg-brand-blue/5' : 'border-white/10 bg-transparent'
              }`}
            >
              {photoSelected ? (
                <>
                  <Camera className="w-6 h-6 text-brand-blue animate-pulse" />
                  <span className="text-[10px] text-white font-bold">Image_Verification_Captured.jpg Loaded</span>
                  <span className="text-[8px] text-gray-500 font-mono">1.2 MB. Click to replace photo.</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-gray-500" />
                  <span className="text-[10px] text-gray-300 font-semibold">Verify with mobile camera capture / Photo upload</span>
                  <span className="text-[8px] text-gray-600 font-mono">JPG, PNG allowed (Drag file or click box)</span>
                </>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 py-3 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue font-bold text-xs text-white hover:opacity-95 shadow-lg flex items-center justify-center gap-1.5 mt-2 disabled:opacity-50"
          >
            {submitting ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <Activity className="w-4 h-4 text-emerald-400" />
                Commit Audit Log & Trigger AI Re-calculations
              </>
            )}
          </button>

        </form>
      )}

    </div>
  );
}
