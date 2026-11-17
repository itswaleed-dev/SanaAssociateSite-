'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit, Save, X, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface Project { _id?: string; id?: string; title: string; category: string; location: string; year: number; description: string; coverImage: string; images: string[]; featured: boolean; }

export default function AdminProjects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Project | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({ category: 'Architecture', featured: false, images: [] });

  const loadProjects = async () => {
    try {
      const r = await fetch('/api/projects');
      const j = await r.json();
      setProjects(j.success ? j.data : []);
    } catch {
      toast('error', 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadProjects(); }, []);

  const startEdit = (p: Project) => { setEditingId(p._id || p.id || null); setEditForm({...p}); };
  const cancelEdit = () => { setEditingId(null); setEditForm(null); };

  const saveEdit = async () => {
    if (!editForm || !editForm._id) return;
    setSaving(true);
    try {
      const r = await fetch('/api/projects/' + editForm._id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
      const j = await r.json();
      if (r.ok) {
        toast('success', 'Project updated successfully');
        await loadProjects();
        cancelEdit();
      } else {
        toast('error', j.error || 'Update failed');
      }
    } catch {
      toast('error', 'Update failed');
    }
    setSaving(false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      const r = await fetch('/api/projects/' + id, { method: 'DELETE' });
      if (r.ok) {
        toast('success', 'Project deleted');
        await loadProjects();
      } else {
        toast('error', 'Failed to delete project');
      }
    } catch {
      toast('error', 'Delete failed');
    }
  };

  const addProject = async () => {
    if (!newProject.title) {
      toast('error', 'Project title is required');
      return;
    }
    setSaving(true);
    try {
      const r = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProject) });
      const j = await r.json();
      if (r.ok) {
        toast('success', 'Project created successfully');
        await loadProjects();
        setShowAdd(false);
        setNewProject({ category: 'Architecture', featured: false, images: [] });
      } else {
        toast('error', j.error || 'Failed to create project');
      }
    } catch {
      toast('error', 'Create failed');
    }
    setSaving(false);
  };

  const icls = "w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#52d6d0] focus:border-[#52d6d0]/30";

  return (
    <div className="min-h-screen bg-[#0a0a0a] lg:pl-64 pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-sm text-[#52d6d0] hover:underline flex items-center gap-1 mb-2"><ArrowLeft size={14} /> Dashboard</Link>
            <h1 className="text-2xl font-bold text-white">Manage Projects</h1>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-[#52d6d0] text-black rounded-xl text-sm font-medium hover:bg-[#8aeae3] transition-colors">
            <Plus size={16} /> Add Project
          </button>
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] rounded-2xl p-6 mb-6 border border-white/5 space-y-4">
            <h3 className="font-bold text-white">New Project</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-xs font-medium text-white/40">Title *</label><input value={newProject.title||''} onChange={e=>setNewProject(p=>({...p,title:e.target.value}))} className={icls} /></div>
              <div><label className="text-xs font-medium text-white/40">Category</label><select value={newProject.category} onChange={e=>setNewProject(p=>({...p,category:e.target.value}))} className={icls}><option>Architecture</option><option>Interior</option><option>Exterior</option></select></div>
              <div><label className="text-xs font-medium text-white/40">Location</label><input value={newProject.location||''} onChange={e=>setNewProject(p=>({...p,location:e.target.value}))} className={icls} /></div>
              <div><label className="text-xs font-medium text-white/40">Year</label><input type="number" value={newProject.year||''} onChange={e=>setNewProject(p=>({...p,year:+e.target.value}))} className={icls} /></div>
              <div className="sm:col-span-2"><label className="text-xs font-medium text-white/40">Description</label><textarea value={newProject.description||''} onChange={e=>setNewProject(p=>({...p,description:e.target.value}))} className={icls} rows={2} /></div>
              <div className="sm:col-span-2"><label className="text-xs font-medium text-white/40">Cover Image URL</label><input value={newProject.coverImage||''} onChange={e=>setNewProject(p=>({...p,coverImage:e.target.value}))} className={icls} placeholder="https://..." /></div>
              <div className="sm:col-span-2"><label className="text-xs font-medium text-white/40">Images (comma-separated URLs)</label><input value={(newProject.images||[]).join(', ')} onChange={e=>setNewProject(p=>({...p,images:e.target.value.split(',').map((s:string)=>s.trim()).filter(Boolean)}))} className={icls} /></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={newProject.featured||false} onChange={e=>setNewProject(p=>({...p,featured:e.target.checked}))} /> <span className="text-xs font-medium text-white/40">Featured</span></label></div>
            </div>
            <div className="flex gap-3">
              <button onClick={addProject} disabled={saving} className="px-4 py-2 bg-[#52d6d0] text-black rounded-lg text-sm font-medium hover:bg-[#8aeae3]">{saving ? 'Saving...' : 'Save'}</button>
              <button onClick={()=>setShowAdd(false)} className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm">Cancel</button>
            </div>
          </motion.div>
        )}

        {loading ? <div className="text-center py-16"><Loader2 className="animate-spin mx-auto text-[#52d6d0]" size={32} /></div> : (
          <div className="space-y-4">
            {projects.map(p => (
              <motion.div key={p._id || p.id} layout className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
                {editingId === (p._id || p.id) && editForm ? (
                  <div className="p-6 space-y-4">
                    <h3 className="font-bold text-white">Edit Project</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="text-xs text-white/40">Title</label><input value={editForm.title} onChange={e=>setEditForm({...editForm,title:e.target.value})} className={icls} /></div>
                      <div><label className="text-xs text-white/40">Category</label><select value={editForm.category} onChange={e=>setEditForm({...editForm,category:e.target.value})} className={icls}><option>Architecture</option><option>Interior</option><option>Exterior</option></select></div>
                      <div><label className="text-xs text-white/40">Location</label><input value={editForm.location} onChange={e=>setEditForm({...editForm,location:e.target.value})} className={icls} /></div>
                      <div><label className="text-xs text-white/40">Year</label><input type="number" value={editForm.year} onChange={e=>setEditForm({...editForm,year:+e.target.value})} className={icls} /></div>
                      <div className="sm:col-span-2"><label className="text-xs text-white/40">Description</label><textarea value={editForm.description} onChange={e=>setEditForm({...editForm,description:e.target.value})} className={icls} rows={2} /></div>
                      <div className="sm:col-span-2"><label className="text-xs text-white/40">Cover Image URL</label><input value={editForm.coverImage} onChange={e=>setEditForm({...editForm,coverImage:e.target.value})} className={icls} /></div>
                      <div className="sm:col-span-2"><label className="text-xs text-white/40">Images (comma separated)</label><input value={(editForm.images||[]).join(', ')} onChange={e=>setEditForm({...editForm,images:e.target.value.split(',').map((s:string)=>s.trim()).filter(Boolean)})} className={icls} /></div>
                      <div><label className="flex items-center gap-2"><input type="checkbox" checked={editForm.featured} onChange={e=>setEditForm({...editForm,featured:e.target.checked})} /> <span className="text-xs text-white/40">Featured</span></label></div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={saveEdit} disabled={saving} className="px-4 py-2 bg-[#52d6d0] text-black rounded-lg text-sm"><Save size={14} /> {saving ? 'Saving...' : 'Save'}</button>
                      <button onClick={cancelEdit} className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm"><X size={14} /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-4 gap-4">
                    <img src={p.coverImage} alt={p.title} className="w-20 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">{p.title}</h4>
                      <p className="text-xs text-white/30">{p.category} · {p.location} · {p.year}</p>
                    </div>
                    {p.featured && <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#52d6d0]/10 text-[#52d6d0]">Featured</span>}
                    <button onClick={()=>startEdit(p)} className="p-2 text-white/30 hover:text-[#52d6d0]"><Edit size={16} /></button>
                    <button onClick={()=>deleteProject(p._id || p.id || '')} className="p-2 text-white/30 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
