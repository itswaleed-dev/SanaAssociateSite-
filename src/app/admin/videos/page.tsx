'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit, Save, X, Loader2, Video as VideoIcon, Play } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface VideoItem {
  _id?: string;
  title: string;
  url: string;
  type: 'youtube' | 'mp4';
  thumbnail: string;
}

export default function AdminVideos() {
  const { toast } = useToast();
  const [items, setItems] = useState<VideoItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<VideoItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItem, setNewItem] = useState<VideoItem>({
    title: '',
    url: '',
    type: 'youtube',
    thumbnail: '',
  });

  const loadItems = async () => {
    try {
      const r = await fetch('/api/videos');
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to load videos');
      setItems(j.success ? j.data : []);
    } catch (error: any) {
      toast('error', error.message || 'Could not load videos.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const startEdit = (item: VideoItem) => {
    setEditId(item._id || null);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm?._id) return;
    if (!editForm.url || !editForm.title) {
      toast('error', 'Title and Video URL are required');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch(`/api/videos/${editForm._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Update failed');

      toast('success', 'Video updated successfully');
      await loadItems();
      cancelEdit();
    } catch (error: any) {
      toast('error', error.message || 'Could not update video.');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const r = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Delete failed');

      toast('success', 'Video deleted successfully');
      await loadItems();
    } catch (error: any) {
      toast('error', error.message || 'Could not delete video.');
    }
  };

  const addItem = async () => {
    if (!newItem.url || !newItem.title) {
      toast('error', 'Title and Video URL are required');
      return;
    }

    setSaving(true);
    try {
      const r = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Add failed');

      toast('success', 'Video added successfully');
      await loadItems();
      setShowAdd(false);
      setNewItem({ title: '', url: '', type: 'youtube', thumbnail: '' });
    } catch (error: any) {
      toast('error', error.message || 'Could not add video.');
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
              <VideoIcon className="text-[#52d6d0]" size={24} /> Manage Videos
            </h1>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#52d6d0] text-black rounded-xl text-sm font-medium hover:bg-[#8aeae3]"
          >
            <Plus size={16} /> Add Video
          </button>
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#121212] rounded-2xl p-6 mb-6 border border-white/5 space-y-4">
            <h3 className="font-bold text-white">New Video Showcase</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-white/40">Title *</label>
                <input value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} className={icls} placeholder="Modern Home Walkthrough" />
              </div>
              <div>
                <label className="text-xs font-medium text-white/40">Video Type</label>
                <select value={newItem.type} onChange={e => setNewItem(p => ({ ...p, type: e.target.value as 'youtube' | 'mp4' }))} className={icls}>
                  <option value="youtube">YouTube Embed</option>
                  <option value="mp4">Direct MP4 URL</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-white/40">Video URL *</label>
                <input value={newItem.url} onChange={e => setNewItem(p => ({ ...p, url: e.target.value }))} className={icls} placeholder="https://www.youtube.com/embed/..." />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-white/40">Thumbnail Image URL</label>
                <input value={newItem.thumbnail} onChange={e => setNewItem(p => ({ ...p, thumbnail: e.target.value }))} className={icls} placeholder="https://images.unsplash.com/..." />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={addItem} disabled={saving} className="px-4 py-2 bg-[#52d6d0] text-black rounded-lg text-sm font-medium hover:bg-[#8aeae3]">
                {saving ? 'Saving...' : 'Save Video'}
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
                No videos found. Click &ldquo;Add Video&rdquo; to add your first video showcase.
              </div>
            ) : (
              items.map(item => (
                <motion.div key={item._id} layout className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden">
                  {editId === item._id ? (
                    <div className="p-6 space-y-4">
                      <h3 className="font-bold text-white">Edit Video</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-white/40">Title</label>
                          <input value={editForm?.title || ''} onChange={e => setEditForm(p => p ? { ...p, title: e.target.value } : null)} className={icls} />
                        </div>
                        <div>
                          <label className="text-xs text-white/40">Video Type</label>
                          <select value={editForm?.type || 'youtube'} onChange={e => setEditForm(p => p ? { ...p, type: e.target.value as 'youtube' | 'mp4' } : null)} className={icls}>
                            <option value="youtube">YouTube Embed</option>
                            <option value="mp4">Direct MP4 URL</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs text-white/40">Video URL</label>
                          <input value={editForm?.url || ''} onChange={e => setEditForm(p => p ? { ...p, url: e.target.value } : null)} className={icls} />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs text-white/40">Thumbnail Image URL</label>
                          <input value={editForm?.thumbnail || ''} onChange={e => setEditForm(p => p ? { ...p, thumbnail: e.target.value } : null)} className={icls} />
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
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black/40 shrink-0">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20"><Play size={20} /></div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-black/70 text-white">
                          {item.type}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">{item.title || 'Untitled'}</h4>
                        <p className="text-xs text-white/30 truncate mt-0.5">{item.url}</p>
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
