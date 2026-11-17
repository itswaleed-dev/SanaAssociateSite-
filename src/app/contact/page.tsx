'use client';
import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Clock, Loader2, Send, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', projectType: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast('error', 'Please fill in all required fields (Name, Email, and Message).');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast('success', 'Thank you! Your inquiry has been received.');
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', projectType: '', message: '' });
      } else {
        toast('error', data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch {
      toast('error', 'Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const icls = "w-full px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/10 focus:border-[#52d6d0]/60 focus:outline-none focus:ring-1 focus:ring-[#52d6d0]/30 text-white placeholder:text-white/25 text-sm transition-all duration-300";
  const lcls = "block text-xs font-bold tracking-wider uppercase text-white/50 mb-2";

  return (
    <div className="pt-28 pb-28 bg-[#070707] min-h-screen relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/4 w-[32rem] h-[32rem] bg-[#52d6d0]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs tracking-[0.25em] uppercase text-[#52d6d0] font-semibold mb-4">
            <Sparkles size={12} /> Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-2 mb-4 tracking-tight leading-tight">
            Let&apos;s Build Your <br />
            <span className="text-gradient">Next Masterpiece</span>
          </h1>
          <p className="text-white/50 max-w-xl text-base sm:text-lg font-light leading-relaxed">
            Have a residential or commercial project in mind? Our principal architects will review your requirements and respond within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Studio Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-8 border border-white/[0.08] space-y-6">
              <h3 className="text-xl font-bold text-white tracking-tight border-b border-white/[0.06] pb-4">
                Studio Headquarters
              </h3>

              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    title: 'Office Location',
                    desc: '20 – A Ahbab Co-Operative Housing Society, G – 3 Johar Town, Lahore, Pakistan, 54000',
                  },
                  {
                    icon: Mail,
                    title: 'Email Address',
                    desc: 'waleedcoderz@gmail.com',
                    action: 'mailto:waleedcoderz@gmail.com',
                  },
                  {
                    icon: Phone,
                    title: 'Direct Phone',
                    desc: '+92 341 7945411',
                    action: 'tel:+923417945411',
                  },
                  {
                    icon: Clock,
                    title: 'Studio Hours',
                    desc: 'Monday – Saturday: 9:00 AM – 6:00 PM',
                  },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4 items-start">
                      <div className="w-11 h-11 rounded-2xl bg-[#52d6d0]/10 flex items-center justify-center text-[#52d6d0] shrink-0 border border-[#52d6d0]/20">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white/90">{item.title}</h4>
                        {item.action ? (
                          <a href={item.action} className="text-white/50 text-sm hover:text-[#52d6d0] transition-colors mt-0.5 block">
                            {item.desc}
                          </a>
                        ) : (
                          <p className="text-white/50 text-sm mt-0.5 leading-relaxed font-light">{item.desc}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-white/[0.06]">
                <a
                  href="https://wa.me/+923417945411?text=Hello%20Sana%20Associates!%20I%20would%20like%20to%20inquire%20about%20architectural%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <MessageCircle size={16} /> Direct WhatsApp Chat
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiries Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-3xl p-10 sm:p-14 border border-[#52d6d0]/30 text-center space-y-5 shadow-2xl"
              >
                <div className="w-20 h-20 rounded-full bg-[#52d6d0]/10 text-[#52d6d0] flex items-center justify-center mx-auto border border-[#52d6d0]/30">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">Inquiry Received</h3>
                <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed font-light">
                  Thank you for entrusting Sana Associates with your architectural project. A principal architect will review your brief and contact you shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3.5 rounded-full bg-[#52d6d0] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#8aeae3] transition-all"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-3xl p-8 sm:p-10 border border-white/[0.08] space-y-6 shadow-2xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={lcls}>Full Name *</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className={icls}
                      placeholder="e.g. Usman Malik"
                    />
                  </div>
                  <div>
                    <label className={lcls}>Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className={icls}
                      placeholder="e.g. usman@example.com"
                    />
                  </div>
                  <div>
                    <label className={lcls}>Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className={icls}
                      placeholder="+92 300 0000000"
                    />
                  </div>
                  <div>
                    <label className={lcls}>Project Type</label>
                    <select
                      value={form.projectType}
                      onChange={e => setForm(p => ({ ...p, projectType: e.target.value }))}
                      className={icls}
                    >
                      <option value="" className="bg-[#0e0e0e]">Select project type</option>
                      <option value="Architectural Design" className="bg-[#0e0e0e]">Architectural Design</option>
                      <option value="Interior Design" className="bg-[#0e0e0e]">Luxury Interior Design</option>
                      <option value="Exterior Design" className="bg-[#0e0e0e]">Exterior & Facade Design</option>
                      <option value="3D Visualization" className="bg-[#0e0e0e]">3D Walkthrough & Renderings</option>
                      <option value="Full Home Turnkey" className="bg-[#0e0e0e]">Full Home Turnkey Project</option>
                      <option value="Commercial Architecture" className="bg-[#0e0e0e]">Commercial Architecture</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={lcls}>Project Description & Site Details *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className={icls}
                    placeholder="Tell us about plot size (e.g. 1 Kanal), location (e.g. DHA Phase 6), preferred architectural style, and timeline..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl bg-[#52d6d0] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#8aeae3] shadow-lg shadow-[#52d6d0]/25 transition-all duration-300 disabled:opacity-50 hover:scale-[1.01]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Inquiry
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
