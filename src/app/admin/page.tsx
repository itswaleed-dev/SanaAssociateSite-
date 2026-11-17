'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard,
  FolderKanban,
  Images,
  Video,
  Users,
  Star,
  MessageSquare,
  Home,
  Plus,
  ChevronRight,
  Database,
  Loader2,
  RefreshCw,
  Activity,
  LogOut,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Gallery', href: '/admin/gallery', icon: Images },
  { label: 'Videos', href: '/admin/videos', icon: Video },
  { label: 'Team', href: '/admin/team', icon: Users },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: '← View Site', href: '/', icon: Home },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({
    projects: 0,
    gallery: 0,
    videos: 0,
    team: 0,
    testimonials: 0,
    contacts: { total: 0, new: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadCounts = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/stats');
      const j = await r.json();
      if (j.success && j.data) {
        setCounts(j.data);
      }
    } catch {
      toast('error', 'Could not load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  const handleSeedDatabase = async () => {
    if (!confirm('This will seed the database with sample projects, gallery items, videos, team members, testimonials, and inquiries. Continue?')) {
      return;
    }

    setSeeding(true);
    try {
      const r = await fetch('/api/seed', { method: 'POST' });
      const j = await r.json();
      if (r.ok && j.success) {
        toast('success', 'Database seeded successfully with initial data!');
        await loadCounts();
      } else {
        toast('error', j.error || 'Failed to seed database');
      }
    } catch (error: any) {
      toast('error', error.message || 'Seeding error');
    } finally {
      setSeeding(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        toast('error', 'Could not sign out');
        return;
      }
      window.location.assign('/login');
    } catch {
      toast('error', 'Could not sign out');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-[#1a1a1a] border border-white/5"
      >
        <LayoutDashboard size={20} className="text-white" />
      </button>

      <aside className={'fixed top-0 left-0 h-full w-64 bg-[#050505] border-r border-white/5 z-40 transition-transform lg:translate-x-0 ' + (sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="p-4 border-b border-white/5">
          <Link href="/"><img src="/LOGO1.png" alt="Sana Associates" className=" h-15 w-55 object-cover " /></Link>
          <p className="text-xs text-white/30 mt-2 ml-5">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Icon size={18} /> {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} /> Sign out
          </button>
        </nav>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="lg:pl-64 pt-8 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-white/30 text-sm">Manage website content & customer inquiries</p>
            </motion.div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadCounts}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl border border-white/5 transition-colors"
                title="Refresh stats"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-xl text-sm font-medium transition-all"
              >
                {seeding ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
                {seeding ? 'Seeding...' : 'Seed Database'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Projects', value: counts.projects, icon: FolderKanban, color: 'bg-blue-500', href: '/admin/projects' },
              { label: 'Gallery', value: counts.gallery, icon: Images, color: 'bg-purple-500', href: '/admin/gallery' },
              { label: 'Videos', value: counts.videos, icon: Video, color: 'bg-emerald-500', href: '/admin/videos' },
              { label: 'Team', value: counts.team, icon: Users, color: 'bg-[#52d6d0]', href: '/admin/team' },
              { label: 'Testimonials', value: counts.testimonials, icon: Star, color: 'bg-amber-500', href: '/admin/testimonials' },
              {
                label: 'Inquiries',
                value: counts.contacts.total,
                badge: counts.contacts.new > 0 ? `${counts.contacts.new} new` : null,
                icon: MessageSquare,
                color: 'bg-rose-500',
                href: '/admin/messages',
              },
            ].map(s => {
              const Icon = s.icon;
              return (
                <Link key={s.label} href={s.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#121212] rounded-2xl p-5 border border-white/5 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={'w-10 h-10 rounded-xl ' + s.color + ' flex items-center justify-center text-white'}>
                        <Icon size={20} />
                      </div>
                      <div className="flex items-center gap-2">
                        {s.badge && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 animate-pulse">
                            {s.badge}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-white">{loading ? '...' : s.value}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/40">{s.label}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Add Project', href: '/admin/projects', icon: Plus },
              { label: 'Upload Gallery', href: '/admin/gallery', icon: Plus },
              { label: 'Add Video', href: '/admin/videos', icon: Plus },
              { label: 'Add Team', href: '/admin/team', icon: Plus },
            ].map(a => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  href={a.href}
                  className="p-5 bg-[#121212] rounded-2xl border border-white/5 hover:border-[#52d6d0]/20 hover:shadow-lg transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#52d6d0]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[#52d6d0]" />
                  </div>
                  <span className="font-medium text-white text-sm">{a.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Projects', desc: 'Manage architecture, interior & exterior projects', href: '/admin/projects', icon: FolderKanban },
              { title: 'Gallery', desc: 'Upload and manage design images', href: '/admin/gallery', icon: Images },
              { title: 'Videos', desc: 'Add YouTube or MP4 video showcases', href: '/admin/videos', icon: Video },
              { title: 'Team', desc: 'Manage team members and profiles', href: '/admin/team', icon: Users },
              { title: 'Testimonials', desc: 'Manage client reviews and ratings', href: '/admin/testimonials', icon: Star },
              { title: 'Messages', desc: 'View and respond to client inquiries', href: '/admin/messages', icon: MessageSquare },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="bg-[#121212] rounded-2xl p-6 border border-white/5 hover:border-[#52d6d0]/20 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#52d6d0]/10 transition-colors">
                      <Icon size={22} className="text-white/40 group-hover:text-[#52d6d0] transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{item.title}</h3>
                      <p className="text-sm text-white/30">{item.desc}</p>
                    </div>
                    <ChevronRight size={18} className="ml-auto text-white/20 group-hover:text-[#52d6d0]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
