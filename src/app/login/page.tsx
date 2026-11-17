'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LockKeyhole } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Unable to sign in');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-5">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121212] p-8 shadow-2xl">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#52d6d0]/10 text-[#52d6d0]">
          <LockKeyhole size={22} />
        </div>
        <h1 className="text-2xl font-bold text-white">Admin sign in</h1>
        <p className="mt-2 text-sm text-white/50">Sign in to manage Sana Associates.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-white/70">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#52d6d0]"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-white/70">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#52d6d0]"
            />
          </div>
          {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#52d6d0] px-4 py-3 font-semibold text-black transition-colors hover:bg-[#8aeae3] disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
