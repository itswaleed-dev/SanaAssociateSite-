'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit, Save, X, Loader2, Star, Quote } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface TestimonialItem {
  _id?: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  review: string;
}

export default function AdminTestimonials() {
  const { toast } = useToast();
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TestimonialItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState<TestimonialItem>({
    name: '',
    role: '',
    image: '',
    rating: 5,
    review: '',
  });

  const loadItems = async () => {
    try {
      const r = await fetch('/api/testimonials');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to load testimonials');
      setItems(j.success ? j.data : []);
    } catch (error: any) {
      toast('error', error.message || 'Could not load testimonials.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const startEdit = (item: TestimonialItem) => {
    setEditId(item._id || null);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm?._id) return;
    if (!editForm.name || !editForm.review) {
      toast('error', 'Name and review are required');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch(`/api/testimonials/${editForm._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Update failed');

      toast('success', 'Testimonial updated successfully');
      await loadItems();
      cancelEdit();
    } catch (error: any) {
      toast('error', error.message || 'Could not update testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const r = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Delete failed');

      toast('success', 'Testimonial deleted successfully');
      await loadItems();
    } catch (error: any) {
      toast('error', error.message || 'Could not delete testimonial.');
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.review) {
      toast('error', 'Name and review text are required');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Add failed');

      toast('success', 'Testimonial added successfully');
      await loadItems();
      setShowAdd(false);
      setNewItem({ name: '', role: '', image: '', rating: 5, review: '' });
    } catch (error: any) {
      toast('error', error.message || 'Could not add testimonial.');
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
              <Quote className="text-[#52d6d0]" size={24} /> Manage Testimonials
            </h1>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#52d6d0] text-black rounded-xl text-sm font-medium hover:bg-[#8aeae3]"
          >
            <Plus size={16} /> Add Testimonial
          </button>
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121212] rounded-2xl p-6 mb-6 border border-white/5 space-y-4">
            <h3 className="font-bold text-white">New Client Testimonial</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-white/40">Client Name *</label>
                <input value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} className={icls} placeholder="Usman & Ayesha" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40">Role / Location</label>
                <input value={newItem.role} onChange={e => setNewItem(p => ({ ...p, role: e.target.value }))} className={icls} placeholder="Homeowners, DHA" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40">Rating (1 to 5 Stars)</label>
                <select value={newItem.rating} onChange={e => setNewItem(p => ({ ...p, rating: Number(e.target.value) }))} className={icls}>
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                  <option value={2}>2 Stars ★★☆☆☆</option>
                  <option value={1}>1 Star  ★☆☆☆☆</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-white/40">Avatar / Client Photo URL</label>
                <input value={newItem.image} onChange={e => setNewItem(p => ({ ...p, image: e.target.value }))} className={icls} placeholder="https://images.unsplash.com/..." />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-white/40">Review / Testimonial *</label>
                <textarea rows={3} value={newItem.review} onChange={e => setNewItem(p => ({ ...p, review: e.target.value }))} className={icls} placeholder="Sana Associates designed our dream home..." />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={addItem} disabled={saving} className="px-4 py-2 bg-[#52d6d0] text-black rounded-lg text-sm font-medium hover:bg-[#8aeae3]">
                {saving ? 'Saving...' : 'Save Testimonial'}
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
                No testimonials found. Click &ldquo;Add Testimonial&rdquo; to add your first client review.
              </div>
            ) : (
              items.map(item => (
                <motion.div key={item._id} layout className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
                  {editId === item._id ? (
                    <div className="p-6 space-y-4">
                      <h3 className="font-bold text-white">Edit Testimonial</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-white/40">Client Name</label>
                          <input value={editForm?.name || ''} onChange={e => setEditForm(p => p ? { ...p, name: e.target.value } : null)} className={icls} />
                        </div>
                        <div>
                          <label className="text-xs text-white/40">Role</label>
                          <input value={editForm?.role || ''} onChange={e => setEditForm(p => p ? { ...p, role: e.target.value } : null)} className={icls} />
                        </div>
                        <div>
                          <label className="text-xs text-white/40">Rating</label>
                          <select value={editForm?.rating || 5} onChange={e => setEditForm(p => p ? { ...p, rating: Number(e.target.value) } : null)} className={icls}>
                            <option value={5}>5 Stars ★★★★★</option>
                            <option value={4}>4 Stars ★★★★☆</option>
                            <option value={3}>3 Stars ★★★☆☆</option>
                            <option value={2}>2 Stars ★★☆☆☆</option>
                            <option value={1}>1 Star  ★☆☆☆☆</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-white/40">Client Photo URL</label>
                          <input value={editForm?.image || ''} onChange={e => setEditForm(p => p ? { ...p, image: e.target.value } : null)} className={icls} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs text-white/40">Review</label>
                          <textarea rows={3} value={editForm?.review || ''} onChange={e => setEditForm(p => p ? { ...p, review: e.target.value } : null)} className={icls} />
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
                    <div className="flex items-start p-5 gap-4">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-white/10 mt-1" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 shrink-0 font-bold mt-1">
                          {item.name ? item.name.charAt(0) : '?'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{item.name}</h4>
                          <span className="text-xs text-white/40">({item.role || 'Client'})</span>
                          <div className="flex items-center text-amber-400 ml-auto">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={13} fill={i < item.rating ? 'currentColor' : 'none'} className={i < item.rating ? 'text-amber-400' : 'text-white/10'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-white/70 italic">&ldquo;{item.review}&rdquo;</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button onClick={() => startEdit(item)} className="p-2 text-white/30 hover:text-[#52d6d0]" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteItem(item._id)} className="p-2 text-white/30 hover:text-red-400" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
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
