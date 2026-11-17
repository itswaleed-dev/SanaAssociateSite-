'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit, Save, X, Loader2, Users } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface TeamMember {
  _id?: string;
  name: string;
  position: string;
  image: string;
  bio: string;
}

export default function AdminTeam() {
  const { toast } = useToast();
  const [items, setItems] = useState<TeamMember[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TeamMember | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState<TeamMember>({
    name: '',
    position: '',
    image: '',
    bio: '',
  });

  const loadItems = async () => {
    try {
      const r = await fetch('/api/team');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to load team members');
      setItems(j.success ? j.data : []);
    } catch (error: any) {
      toast('error', error.message || 'Could not load team members.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const startEdit = (item: TeamMember) => {
    setEditId(item._id || null);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm?._id) return;
    if (!editForm.name) {
      toast('error', 'Name is required');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch(`/api/team/${editForm._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Update failed');

      toast('success', 'Team member updated successfully');
      await loadItems();
      cancelEdit();
    } catch (error: any) {
      toast('error', error.message || 'Could not update team member.');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const r = await fetch(`/api/team/${id}`, { method: 'DELETE' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Delete failed');

      toast('success', 'Team member deleted successfully');
      await loadItems();
    } catch (error: any) {
      toast('error', error.message || 'Could not delete team member.');
    }
  };

  const addItem = async () => {
    if (!newItem.name) {
      toast('error', 'Name is required');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Add failed');

      toast('success', 'Team member added successfully');
      await loadItems();
      setShowAdd(false);
      setNewItem({ name: '', position: '', image: '', bio: '' });
    } catch (error: any) {
      toast('error', error.message || 'Could not add team member.');
    } finally {
      setSaving(false);
    }
  };

  const icls = "w-full px-3 py-2 rounded-lg bg-[#0a0a0a] border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#52d6d0]";

  return (
    <div className="min-h-screen bg-[#0a0a0a] lg:pl-64 pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-sm text-[#52d6d0] hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="text-[#52d6d0]" size={24} /> Manage Team
            </h1>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#52d6d0] text-black rounded-xl text-sm font-medium hover:bg-[#8aeae3]"
          >
            <Plus size={16} /> Add Member
          </button>
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121212] rounded-2xl p-6 mb-6 border border-white/5 space-y-4">
            <h3 className="font-bold text-white">New Team Member</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-white/40">Full Name *</label>
                <input value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} className={icls} placeholder="Ahmed Khan" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40">Position / Title</label>
                <input value={newItem.position} onChange={e => setNewItem(p => ({ ...p, position: e.target.value }))} className={icls} placeholder="Principal Architect" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-white/40">Profile Image URL</label>
                <input value={newItem.image} onChange={e => setNewItem(p => ({ ...p, image: e.target.value }))} className={icls} placeholder="https://images.unsplash.com/..." />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-white/40">Bio / Summary</label>
                <textarea rows={3} value={newItem.bio} onChange={e => setNewItem(p => ({ ...p, bio: e.target.value }))} className={icls} placeholder="15+ years experience in architecture..." />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={addItem} disabled={saving} className="px-4 py-2 bg-[#52d6d0] text-black rounded-lg text-sm font-medium hover:bg-[#8aeae3]">
                {saving ? 'Saving...' : 'Save Member'}
              </button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-16"><Loader2 className="animate-spin mx-auto text-[#52d6d0]" size={32} /></div>
        ) : (
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="p-8 text-center text-white/40 bg-[#121212] rounded-2xl border border-white/5">
                No team members found. Click &ldquo;Add Member&rdquo; to add your first team profile.
              </div>
            ) : (
              items.map(item => (
                <motion.div key={item._id} layout className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
                  {editId === item._id ? (
                    <div className="p-6 space-y-4">
                      <h3 className="font-bold text-white">Edit Member</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-white/40">Full Name</label>
                          <input value={editForm?.name || ''} onChange={e => setEditForm(p => p ? { ...p, name: e.target.value } : null)} className={icls} />
                        </div>
                        <div>
                          <label className="text-xs text-white/40">Position</label>
                          <input value={editForm?.position || ''} onChange={e => setEditForm(p => p ? { ...p, position: e.target.value } : null)} className={icls} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs text-white/40">Profile Image URL</label>
                          <input value={editForm?.image || ''} onChange={e => setEditForm(p => p ? { ...p, image: e.target.value } : null)} className={icls} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs text-white/40">Bio</label>
                          <textarea rows={3} value={editForm?.bio || ''} onChange={e => setEditForm(p => p ? { ...p, bio: e.target.value } : null)} className={icls} />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={saveEdit} disabled={saving} className="px-4 py-2 bg-[#52d6d0] text-black rounded-lg text-sm flex items-center gap-1.5 font-medium">
                          <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={cancelEdit} className="px-4 py-2 bg-white/5 text-white rounded-lg text-sm flex items-center gap-1.5">
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center p-4 gap-4">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-full object-cover shrink-0 border border-white/10" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/40 shrink-0 font-bold">
                          {item.name ? item.name.charAt(0) : '?'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">{item.name}</h4>
                        <p className="text-xs text-[#52d6d0] mt-0.5">{item.position || 'Team Member'}</p>
                        {item.bio && <p className="text-xs text-white/30 truncate mt-1">{item.bio}</p>}
                      </div>
                      <button onClick={() => startEdit(item)} className="p-2 text-white/30 hover:text-[#52d6d0]" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteItem(item._id)} className="p-2 text-white/30 hover:text-red-400" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
