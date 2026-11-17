'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit, Save, X, Loader2, Images } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface GalleryItem {
  _id?: string;
  url: string;
  title: string;
  category: 'Architecture' | 'Interior' | 'Exterior';
}

export default function AdminGallery() {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<GalleryItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState<GalleryItem>({
    url: '',
    title: '',
    category: 'Architecture',
  });

  const loadItems = async () => {
    try {
      const r = await fetch('/api/gallery');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to load gallery items');
      setItems(j.success ? j.data : []);
    } catch (error: any) {
      toast('error', error.message || 'Could not load gallery items.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const startEdit = (item: GalleryItem) => {
    setEditId(item._id || null);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm?._id) return;
    if (!editForm.url) {
      toast('error', 'Image URL is required');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch(`/api/gallery/${editForm._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Update failed');

      toast('success', 'Gallery item updated');
      await loadItems();
      cancelEdit();
    } catch (error: any) {
      toast('error', error.message || 'Could not update gallery item.');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const r = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Delete failed');

      toast('success', 'Gallery item deleted');
      await loadItems();
    } catch (error: any) {
      toast('error', error.message || 'Could not delete gallery item.');
    }
  };

  const addItem = async () => {
    if (!newItem.url) {
      toast('error', 'Image URL is required');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Add failed');

      toast('success', 'Gallery item added');
      await loadItems();
      setShowAdd(false);
      setNewItem({ url: '', title: '', category: 'Architecture' });
    } catch (error: any) {
      toast('error', error.message || 'Could not add gallery item.');
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
              <Images className="text-[#52d6d0]" size={24} /> Manage Gallery
            </h1>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#52d6d0] text-black rounded-xl text-sm font-medium hover:bg-[#8aeae3]"
          >
            <Plus size={16} /> Add Image
          </button>
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121212] rounded-2xl p-6 mb-6 border border-white/5 space-y-4">
            <h3 className="font-bold text-white">New Gallery Image</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-white/40">Image URL *</label>
                <input value={newItem.url} onChange={e => setNewItem(p => ({ ...p, url: e.target.value }))} className={icls} placeholder="https://images.unsplash.com/..." />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40">Title</label>
                <input value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} className={icls} placeholder="Modern Villa" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40">Category</label>
                <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value as any }))} className={icls}>
                  <option value="Architecture">Architecture</option>
                  <option value="Interior">Interior</option>
                  <option value="Exterior">Exterior</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={addItem} disabled={saving} className="px-4 py-2 bg-[#52d6d0] text-black rounded-lg text-sm font-medium hover:bg-[#8aeae3]">
                {saving ? 'Saving...' : 'Save Image'}
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
                No images found. Click &ldquo;Add Image&rdquo; to add your first gallery photo.
              </div>
            ) : (
              items.map(item => (
                <motion.div key={item._id} layout className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
                  {editId === item._id ? (
                    <div className="p-6 space-y-4">
                      <h3 className="font-bold text-white">Edit Image</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-xs text-white/40">Image URL</label>
                          <input value={editForm?.url || ''} onChange={e => setEditForm(p => p ? { ...p, url: e.target.value } : null)} className={icls} />
                        </div>
                        <div>
                          <label className="text-xs text-white/40">Title</label>
                          <input value={editForm?.title || ''} onChange={e => setEditForm(p => p ? { ...p, title: e.target.value } : null)} className={icls} />
                        </div>
                        <div>
                          <label className="text-xs text-white/40">Category</label>
                          <select value={editForm?.category || 'Architecture'} onChange={e => setEditForm(p => p ? { ...p, category: e.target.value as any } : null)} className={icls}>
                            <option value="Architecture">Architecture</option>
                            <option value="Interior">Interior</option>
                            <option value="Exterior">Exterior</option>
                          </select>
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
                      {item.url && (
                        <img src={item.url} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">{item.title || 'Untitled'}</h4>
                        <p className="text-xs text-white/30">{item.category}</p>
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
