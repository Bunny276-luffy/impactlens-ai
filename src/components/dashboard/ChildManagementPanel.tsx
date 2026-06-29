'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/contexts/ToastContext';
import { formatDate } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Filter, 
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  BookOpen,
  Calendar,
  Activity,
  Heart
} from 'lucide-react';

export default function ChildManagementPanel() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || 'NGO';
  const { toast } = useToast();

  const [children, setChildren] = useState<any[]>([]);
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [filterNGO, setFilterNGO] = useState('ALL');
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [selectedChild, setSelectedChild] = useState<any>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    school: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelationship: 'Mother',
    ngoId: '',
    height: '120',
    weight: '22',
    nutritionScore: '75',
    learningProgress: 'Average',
    attendanceRate: '90',
    talentIdentification: 'None'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const childRes = await fetch('/api/child');
      const ngoRes = await fetch('/api/analytics');
      if (childRes.ok && ngoRes.ok) {
        const childData = await childRes.json();
        const analyticalData = await ngoRes.json();
        setChildren(childData);
        // Extract NGOs from analytic response
        const ngoList = await fetch('/api/child').then(() => fetchNGOList());
      }
    } catch (err) {
      console.error(err);
      toast('Error loading database.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchNGOList = async () => {
    try {
      const res = await fetch('/api/child'); // Mock check
      // Use standard default mock list
      setNgos([
        { id: 'ngo_1', name: 'Care & Share Education' },
        { id: 'ngo_2', name: 'Nutrition First' },
        { id: 'ngo_3', name: 'Global Hope Foundation' }
      ]);
    } catch (e) {}
  };

  useEffect(() => {
    fetchData();
    fetchNGOList();
  }, []);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      school: '',
      guardianName: '',
      guardianPhone: '',
      guardianRelationship: 'Mother',
      ngoId: ngos[0]?.id || 'ngo_1',
      height: '120',
      weight: '22',
      nutritionScore: '75',
      learningProgress: 'Average',
      attendanceRate: '90',
      talentIdentification: 'None'
    });
    setShowCreateModal(true);
  };

  const openEditModal = (child: any) => {
    const latestHealth = child.healthRecords?.[0] || {};
    const latestEdu = child.educationRecords?.[0] || {};
    
    setFormData({
      name: child.name || '',
      age: String(child.age) || '',
      gender: child.gender || 'Male',
      school: child.school || '',
      guardianName: child.guardianName || '',
      guardianPhone: child.guardianPhone || '',
      guardianRelationship: child.guardianRelationship || 'Mother',
      ngoId: child.ngoId || 'ngo_1',
      height: String(latestHealth.height || '120'),
      weight: String(latestHealth.weight || '22'),
      nutritionScore: String(latestHealth.nutritionScore || '75'),
      learningProgress: latestEdu.learningProgress || 'Average',
      attendanceRate: String(latestEdu.attendanceRate || '90'),
      talentIdentification: latestEdu.talentIdentification || 'None'
    });
    setSelectedChild(child);
    setShowEditModal(true);
  };

  const openDetailDrawer = (child: any) => {
    setSelectedChild(child);
    setShowDetailDrawer(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.school) {
      toast('Please enter child name, age, and school details.', { type: 'warning' });
      return;
    }

    try {
      const res = await fetch('/api/child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          height: Number(formData.height),
          weight: Number(formData.weight),
          nutritionScore: Number(formData.nutritionScore),
          attendanceRate: Number(formData.attendanceRate)
        })
      });

      if (res.ok) {
        toast('Child record successfully created!', { type: 'success', title: 'Record Registered' });
        setShowCreateModal(false);
        fetchData();
      } else {
        toast('Failed to create child record.', { type: 'error' });
      }
    } catch (err) {
      console.error(err);
      toast('Error saving record.', { type: 'error' });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    try {
      const res = await fetch(`/api/child/${selectedChild.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          height: Number(formData.height),
          weight: Number(formData.weight),
          nutritionScore: Number(formData.nutritionScore),
          attendanceRate: Number(formData.attendanceRate)
        })
      });

      if (res.ok) {
        toast('Child profile updated successfully.', { type: 'success', title: 'Record Updated' });
        setShowEditModal(false);
        fetchData();
        // If drawer open, update drawer visual
        if (showDetailDrawer) {
          const updatedChild = await res.json();
          setSelectedChild(updatedChild);
        }
      } else {
        toast('Failed to update record.', { type: 'error' });
      }
    } catch (err) {
      console.error(err);
      toast('Error saving changes.', { type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this child record?')) return;
    try {
      const res = await fetch(`/api/child/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Child profile deleted successfully.', { type: 'success', title: 'Record Removed' });
        setShowDetailDrawer(false);
        fetchData();
      } else {
        toast('Failed to delete child profile.', { type: 'error' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter & Sort computation
  const filteredChildren = children
    .filter((child) => {
      // Search query
      const matchesSearch = 
        child.name.toLowerCase().includes(search.toLowerCase()) ||
        child.school.toLowerCase().includes(search.toLowerCase()) ||
        (child.guardianName && child.guardianName.toLowerCase().includes(search.toLowerCase()));

      // NGO filter
      const matchesNGO = filterNGO === 'ALL' || child.ngoId === filterNGO;

      // Gender filter
      const matchesGender = filterGender === 'ALL' || child.gender === filterGender;

      // Risk category (Priority index logic)
      const aiReport = child.aiReports?.[0] || {};
      const priority = aiReport.priorityRanking ?? 5;
      let matchesRisk = true;
      if (filterRisk === 'CRITICAL') matchesRisk = priority === 1;
      else if (filterRisk === 'HIGH') matchesRisk = priority === 2;
      else if (filterRisk === 'MODERATE') matchesRisk = priority === 3;
      else if (filterRisk === 'STABLE') matchesRisk = priority >= 4;

      return matchesSearch && matchesNGO && matchesGender && matchesRisk;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle nested metrics sorting
      if (sortBy === 'nutrition') {
        valA = a.healthRecords?.[0]?.nutritionScore ?? 0;
        valB = b.healthRecords?.[0]?.nutritionScore ?? 0;
      } else if (sortBy === 'attendance') {
        valA = a.educationRecords?.[0]?.attendanceRate ?? 0;
        valB = b.educationRecords?.[0]?.attendanceRate ?? 0;
      } else if (sortBy === 'priority') {
        valA = a.aiReports?.[0]?.priorityRanking ?? 5;
        valB = b.aiReports?.[0]?.priorityRanking ?? 5;
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return sortOrder === 'asc'
          ? (valA > valB ? 1 : -1)
          : (valB > valA ? 1 : -1);
      }
    });

  const getPriorityBadge = (priority: number) => {
    if (priority === 1) return <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[9px] uppercase">P1: Critical</span>;
    if (priority === 2) return <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[9px] uppercase">P2: High</span>;
    if (priority === 3) return <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-[9px] uppercase">P3: Med</span>;
    return <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase">P5: Stable</span>;
  };

  return (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-[calc(100vh-4rem)] relative">
      
      {/* Title Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Children Profiles Database</h2>
          <p className="text-xs text-gray-400">Complete demographic and clinical records with active sorting.</p>
        </div>
        {(role === 'NGO' || role === 'ADMIN' || role === 'VOLUNTEER') && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90 shadow-md shadow-brand-purple/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Child Profile
          </button>
        )}
      </div>

      {/* Search & Filters Strip */}
      <div className="p-4 rounded-xl bg-bg-panel/40 border border-white/5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, school, guardian..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs glass-input"
            />
          </div>

          {/* Filters toggle */}
          <div className="flex gap-2 flex-wrap text-xs">
            
            {/* NGO Filter */}
            <div className="flex items-center gap-1 bg-white/2 border border-white/8 rounded-lg px-3 py-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold">NGO:</span>
              <select 
                value={filterNGO} 
                onChange={(e) => setFilterNGO(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-bg-panel">All NGOs</option>
                {ngos.map(n => <option key={n.id} value={n.id} className="bg-bg-panel">{n.name}</option>)}
              </select>
            </div>

            {/* Risk filter */}
            <div className="flex items-center gap-1 bg-white/2 border border-white/8 rounded-lg px-3 py-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Risk:</span>
              <select 
                value={filterRisk} 
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-bg-panel">All Risks</option>
                <option value="CRITICAL" className="bg-bg-panel text-red-400">P1: Critical</option>
                <option value="HIGH" className="bg-bg-panel text-amber-400">P2: High Risk</option>
                <option value="MODERATE" className="bg-bg-panel text-blue-400">P3: Moderate</option>
                <option value="STABLE" className="bg-bg-panel text-emerald-400">P5: Stable</option>
              </select>
            </div>

            {/* Gender filter */}
            <div className="flex items-center gap-1 bg-white/2 border border-white/8 rounded-lg px-3 py-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Gender:</span>
              <select 
                value={filterGender} 
                onChange={(e) => setFilterGender(e.target.value)}
                className="bg-transparent text-white focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-bg-panel">All</option>
                <option value="Male" className="bg-bg-panel">Male</option>
                <option value="Female" className="bg-bg-panel">Female</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-white/8 bg-bg-darker/60 overflow-x-auto shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
            <span className="h-6 w-6 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
            Syncing registry...
          </div>
        ) : filteredChildren.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No children profiles match the active query filter.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/1 text-gray-400 uppercase font-bold tracking-wider">
                <th onClick={() => handleSort('name')} className="p-4 cursor-pointer hover:text-white transition-colors">
                  <div className="flex items-center gap-1.5">Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('age')} className="p-4 cursor-pointer hover:text-white transition-colors">
                  <div className="flex items-center gap-1.5">Age/Gender <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-4">School</th>
                <th onClick={() => handleSort('attendance')} className="p-4 cursor-pointer hover:text-white transition-colors">
                  <div className="flex items-center gap-1.5">Attendance <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('nutrition')} className="p-4 cursor-pointer hover:text-white transition-colors">
                  <div className="flex items-center gap-1.5">Nutrition Score <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => handleSort('priority')} className="p-4 cursor-pointer hover:text-white transition-colors">
                  <div className="flex items-center gap-1.5">AI Priority <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredChildren.map((child) => {
                const latestHealth = child.healthRecords?.[0] || {};
                const latestEdu = child.educationRecords?.[0] || {};
                const aiReport = child.aiReports?.[0] || {};
                
                return (
                  <tr key={child.id} className="hover:bg-white/2 group transition-colors">
                    <td className="p-4 font-bold text-white">{child.name}</td>
                    <td className="p-4 text-gray-300">
                      {child.age} yrs / <span className="text-gray-400">{child.gender}</span>
                    </td>
                    <td className="p-4 text-gray-400 max-w-[150px] truncate">{child.school}</td>
                    <td className="p-4 font-semibold">
                      <span className={latestEdu.attendanceRate < 80 ? 'text-red-400' : 'text-emerald-400'}>
                        {latestEdu.attendanceRate ?? 'N/A'}%
                      </span>
                    </td>
                    <td className="p-4 font-semibold">
                      <span className={latestHealth.nutritionScore < 50 ? 'text-red-400' : latestHealth.nutritionScore < 70 ? 'text-amber-400' : 'text-emerald-400'}>
                        {latestHealth.nutritionScore ?? 'N/A'}/100
                      </span>
                    </td>
                    <td className="p-4">{getPriorityBadge(aiReport.priorityRanking ?? 5)}</td>
                    <td className="p-4 text-right flex justify-end gap-1.5">
                      <button 
                        onClick={() => openDetailDrawer(child)}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {(role === 'NGO' || role === 'ADMIN' || role === 'VOLUNTEER') && (
                        <button 
                          onClick={() => openEditModal(child)}
                          className="p-1.5 rounded bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple hover:text-purple-300 transition-all"
                          title="Edit Profile"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(role === 'NGO' || role === 'ADMIN') && (
                        <button 
                          onClick={() => handleDelete(child.id)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-2xl bg-bg-panel border border-white/8 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-sm font-bold text-white">Register New Child Profile</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="glass-input px-3 py-2 text-xs" 
                  placeholder="e.g. Vicky Kumar"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Age *</label>
                  <input 
                    type="number" 
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="glass-input px-3 py-2 text-xs" 
                    placeholder="8"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="glass-input px-3 py-2 text-xs text-white"
                  >
                    <option value="Male" className="bg-bg-panel">Male</option>
                    <option value="Female" className="bg-bg-panel">Female</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">School Enrolled *</label>
                <input 
                  type="text" 
                  required
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  className="glass-input px-3 py-2 text-xs" 
                  placeholder="e.g. Primary School East"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">NGO Association</label>
                <select 
                  value={formData.ngoId}
                  onChange={(e) => setFormData({...formData, ngoId: e.target.value})}
                  className="glass-input px-3 py-2 text-xs text-white"
                >
                  {ngos.map(n => <option key={n.id} value={n.id} className="bg-bg-panel">{n.name}</option>)}
                </select>
              </div>

              <hr className="sm:col-span-2 border-white/5" />
              <span className="sm:col-span-2 text-[10px] font-bold text-brand-purple uppercase">Biometrics & Health Initial Entry</span>

              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Height (cm)</label>
                  <input 
                    type="number" 
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Nutrition Score (0-100)</label>
                  <input 
                    type="number" 
                    value={formData.nutritionScore}
                    onChange={(e) => setFormData({...formData, nutritionScore: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <hr className="sm:col-span-2 border-white/5" />
              <span className="sm:col-span-2 text-[10px] font-bold text-brand-purple uppercase">Guardian Details & Education Indicators</span>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Guardian Name</label>
                <input 
                  type="text" 
                  value={formData.guardianName}
                  onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                  className="glass-input px-3 py-2 text-xs"
                  placeholder="Sunita Kumar"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Guardian Relationship</label>
                  <select 
                    value={formData.guardianRelationship}
                    onChange={(e) => setFormData({...formData, guardianRelationship: e.target.value})}
                    className="glass-input px-3 py-2 text-xs text-white"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Guardian Phone</label>
                  <input 
                    type="text" 
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                    placeholder="+91 99999 88888"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Attendance Rate (%)</label>
                  <input 
                    type="number" 
                    value={formData.attendanceRate}
                    onChange={(e) => setFormData({...formData, attendanceRate: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Learning Progress</label>
                  <select
                    value={formData.learningProgress}
                    onChange={(e) => setFormData({...formData, learningProgress: e.target.value})}
                    className="glass-input px-3 py-2 text-xs text-white"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Average">Average</option>
                    <option value="Needs Support">Needs Support</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Skill / Talent Tag</label>
                  <input 
                    type="text" 
                    value={formData.talentIdentification}
                    onChange={(e) => setFormData({...formData, talentIdentification: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                    placeholder="e.g. Painting, Math"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="sm:col-span-2 py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue font-bold text-xs text-white hover:opacity-95 shadow-lg mt-4 text-center"
              >
                Register & Calculate AI Risk Reports
              </button>

            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-2xl bg-bg-panel border border-white/8 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-sm font-bold text-white">Edit Child Profile: {selectedChild?.name}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="glass-input px-3 py-2 text-xs" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Age</label>
                  <input 
                    type="number" 
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="glass-input px-3 py-2 text-xs" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="glass-input px-3 py-2 text-xs text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">School Enrolled</label>
                <input 
                  type="text" 
                  required
                  value={formData.school}
                  onChange={(e) => setFormData({...formData, school: e.target.value})}
                  className="glass-input px-3 py-2 text-xs" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">NGO Association</label>
                <select 
                  value={formData.ngoId}
                  onChange={(e) => setFormData({...formData, ngoId: e.target.value})}
                  className="glass-input px-3 py-2 text-xs text-white"
                >
                  {ngos.map(n => <option key={n.id} value={n.id} className="bg-bg-panel">{n.name}</option>)}
                </select>
              </div>

              <hr className="sm:col-span-2 border-white/5" />
              <span className="sm:col-span-2 text-[10px] font-bold text-brand-purple uppercase">Audit Biometrics (Logs a new history checkpoint)</span>

              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Height (cm)</label>
                  <input 
                    type="number" 
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Nutrition Score (0-100)</label>
                  <input 
                    type="number" 
                    value={formData.nutritionScore}
                    onChange={(e) => setFormData({...formData, nutritionScore: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <hr className="sm:col-span-2 border-white/5" />
              <span className="sm:col-span-2 text-[10px] font-bold text-brand-purple uppercase">Guardian Details & Education Checkpoints</span>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Guardian Name</label>
                <input 
                  type="text" 
                  value={formData.guardianName}
                  onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                  className="glass-input px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Guardian Relationship</label>
                  <select 
                    value={formData.guardianRelationship}
                    onChange={(e) => setFormData({...formData, guardianRelationship: e.target.value})}
                    className="glass-input px-3 py-2 text-xs text-white"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Guardian Phone</label>
                  <input 
                    type="text" 
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Attendance Rate (%)</label>
                  <input 
                    type="number" 
                    value={formData.attendanceRate}
                    onChange={(e) => setFormData({...formData, attendanceRate: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Learning Progress</label>
                  <select
                    value={formData.learningProgress}
                    onChange={(e) => setFormData({...formData, learningProgress: e.target.value})}
                    className="glass-input px-3 py-2 text-xs text-white"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Average">Average</option>
                    <option value="Needs Support">Needs Support</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Skill / Talent Tag</label>
                  <input 
                    type="text" 
                    value={formData.talentIdentification}
                    onChange={(e) => setFormData({...formData, talentIdentification: e.target.value})}
                    className="glass-input px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="sm:col-span-2 py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue font-bold text-xs text-white hover:opacity-95 shadow-lg mt-4 text-center"
              >
                Save Profile Changes & Recalculate AI Risks
              </button>

            </form>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER */}
      {showDetailDrawer && selectedChild && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg border-l border-white/8 bg-bg-panel/95 backdrop-blur-md shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto animate-slide-in">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">{selectedChild.name}</h3>
              <p className="text-[10px] text-gray-400">UUID: {selectedChild.id}</p>
            </div>
            <button onClick={() => setShowDetailDrawer(false)} className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          {/* Key Info Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-white/2 border border-white/5 text-left">
              <span className="text-[9px] text-gray-500 uppercase font-bold">Age</span>
              <p className="text-xs font-bold text-white mt-0.5">{selectedChild.age} Years</p>
            </div>
            <div className="p-3 rounded-lg bg-white/2 border border-white/5 text-left">
              <span className="text-[9px] text-gray-500 uppercase font-bold">Gender</span>
              <p className="text-xs font-bold text-white mt-0.5">{selectedChild.gender}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/2 border border-white/5 text-left">
              <span className="text-[9px] text-gray-500 uppercase font-bold">NGO Assigned</span>
              <p className="text-xs font-bold text-brand-purple mt-0.5 truncate">{selectedChild.ngo?.name || 'Care & Share'}</p>
            </div>
          </div>

          {/* AI Insights Card */}
          {selectedChild.aiReports?.[0] && (
            <div className="p-4 rounded-xl border border-brand-purple/20 bg-brand-purple/5 text-left flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">AI DIAGNOSTIC SNAPSHOT</span>
                {getPriorityBadge(selectedChild.aiReports[0].priorityRanking)}
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-white">{selectedChild.aiReports[0].riskScore}%</span>
                <span className="text-[10px] text-gray-400">Total Vulnerability Rating</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 mt-1">
                <div>Malnutrition: <span className="font-bold text-white">{selectedChild.aiReports[0].malnutritionPrediction}</span></div>
                <div>Dropout Risk: <span className="font-bold text-white">{selectedChild.aiReports[0].dropoutPrediction}</span></div>
                <div>Talent Tag: <span className="font-bold text-white">{selectedChild.aiReports[0].talentIdentification || 'N/A'}</span></div>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed border-t border-white/5 pt-2 mt-1">
                **Summary**: {selectedChild.aiReports[0].aiSummary}
              </p>
              <p className="text-[11px] text-brand-purple leading-relaxed bg-brand-purple/10 p-2.5 rounded border border-brand-purple/15 mt-1 font-semibold">
                👉 **Intervention**: {selectedChild.aiReports[0].suggestedIntervention}
              </p>
            </div>
          )}

          {/* Demographic & Guardian details */}
          <div className="flex flex-col gap-2.5 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Demographic Registry</h4>
            <div className="p-4 rounded-xl bg-white/2 border border-white/5 flex flex-col gap-2 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">School:</span><span className="text-white font-semibold">{selectedChild.school}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Guardian Name:</span><span className="text-white">{selectedChild.guardianName || 'None'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Relationship:</span><span className="text-white">{selectedChild.guardianRelationship || 'None'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Contact Phone:</span><span className="text-white">{selectedChild.guardianPhone || 'None'}</span></div>
            </div>
          </div>

          {/* Audit Checkpoint logs history */}
          <div className="flex flex-col gap-2.5 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Audit Checkpoint Logs</h4>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {selectedChild.healthRecords?.map((h: any, idx: number) => {
                const edu = selectedChild.educationRecords?.[idx] || {};
                return (
                  <div key={h.id} className="p-3 rounded-lg border border-white/5 bg-white/1 flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] text-gray-500">
                      <span>Log Checkpoint #{selectedChild.healthRecords.length - idx}</span>
                      <span>{formatDate(h.date)}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-[10px] mt-1">
                      <div>Height: <span className="font-semibold text-white">{h.height}cm</span></div>
                      <div>Weight: <span className="font-semibold text-white">{h.weight}kg</span></div>
                      <div>BMI: <span className="font-semibold text-white">{h.bmi}</span></div>
                      <div>Nutrition: <span className="font-semibold text-white">{h.nutritionScore}%</span></div>
                    </div>
                    {edu.attendanceRate !== undefined && (
                      <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-white/5 pt-1.5 mt-1.5 text-gray-400">
                        <div>Attendance: <span className="font-semibold text-white">{edu.attendanceRate}%</span></div>
                        <div>Progress: <span className="font-semibold text-white">{edu.learningProgress}</span></div>
                      </div>
                    )}
                    {h.healthReport && (
                      <p className="text-[10px] text-gray-500 italic mt-1 font-mono">
                        "{h.healthReport}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drawer Actions */}
          {(role === 'NGO' || role === 'ADMIN' || role === 'VOLUNTEER') && (
            <div className="flex gap-2 border-t border-white/5 pt-4 mt-auto">
              <button 
                onClick={() => openEditModal(selectedChild)}
                className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Audit biometric changes
              </button>
              {(role === 'NGO' || role === 'ADMIN') && (
                <button 
                  onClick={() => handleDelete(selectedChild.id)}
                  className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all"
                  title="Delete Profile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
