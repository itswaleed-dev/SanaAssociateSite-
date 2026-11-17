'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Trash2, Mail, Phone, Clock, MessageSquare, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export default function AdminMessages() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const url = activeTab === 'all' ? '/api/contacts' : `/api/contacts?status=${activeTab}`;
      const r = await fetch(url);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to load messages');
      setMessages(j.success ? j.data : []);
    } catch (error: any) {
      toast('error', error.message || 'Could not load inquiries.');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [activeTab]);

  const updateStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    setUpdatingId(id);
    try {
      const r = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Failed to update status');

      toast('success', `Status updated to ${status}`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m));
    } catch (error: any) {
      toast('error', error.message || 'Could not update message status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const r = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Delete failed');

      toast('success', 'Inquiry deleted successfully');
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch (error: any) {
      toast('error', error.message || 'Could not delete inquiry.');
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">New</span>;
      case 'read':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Read</span>;
      case 'replied':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">Replied</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] lg:pl-64 pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-sm text-[#52d6d0] hover:underline flex items-center gap-1 mb-2">
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="text-[#52d6d0]" size={24} /> Client Inquiries & Messages
            </h1>
          </div>
          <button
            onClick={loadMessages}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm border border-white/5 transition-all self-start"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'new', 'read', 'replied'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#52d6d0] text-black font-bold'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab === 'all' ? 'All Inquiries' : tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16"><Loader2 className="animate-spin mx-auto text-[#52d6d0]" size={32} /></div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="p-12 text-center text-white/40 bg-[#121212] rounded-3xl border border-white/5">
                No inquiries found in this view.
              </div>
            ) : (
              messages.map(item => (
                <motion.div
                  key={item._id}
                  layout
                  className={`bg-[#121212] rounded-2xl p-6 border transition-all ${
                    item.status === 'new' ? 'border-[#52d6d0]/30 shadow-lg shadow-[#52d6d0]/5' : 'border-white/5'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{item.name}</h3>
                        {statusBadge(item.status)}
                        {item.projectType && (
                          <span className="px-2.5 py-0.5 rounded text-xs bg-white/5 text-white/60">
                            {item.projectType}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mt-1.5">
                        {item.email && (
                          <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-[#52d6d0]">
                            <Mail size={12} /> {item.email}
                          </a>
                        )}
                        {item.phone && (
                          <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-[#52d6d0]">
                            <Phone size={12} /> {item.phone}
                          </a>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <select
                        value={item.status}
                        onChange={e => updateStatus(item._id, e.target.value as 'new' | 'read' | 'replied')}
                        disabled={updatingId === item._id}
                        className="px-2.5 py-1 rounded-lg bg-[#0a0a0a] border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#52d6d0]"
                      >
                        <option value="new">Mark New</option>
                        <option value="read">Mark Read</option>
                        <option value="replied">Mark Replied</option>
                      </select>
                      <button
                        onClick={() => deleteMessage(item._id)}
                        className="p-2 text-white/30 hover:text-red-400 rounded-lg transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] rounded-xl p-4 text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                    {item.message || '(No message content provided)'}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    {item.email && (
                      <a
                        href={`mailto:${item.email}?subject=Re: Inquiry with Sana Associates - ${encodeURIComponent(item.projectType || 'Project')}`}
                        className="px-3 py-1.5 rounded-lg bg-[#52d6d0]/10 hover:bg-[#52d6d0]/20 text-[#52d6d0] text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Mail size={13} /> Reply via Email
                      </a>
                    )}
                    {item.phone && (
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Phone size={13} /> WhatsApp / Call
                      </a>
                    )}
                    {item.status === 'new' && (
                      <button
                        onClick={() => updateStatus(item._id, 'read')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <CheckCircle2 size={13} /> Mark as Read
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
