import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm glass-panel rounded-3xl p-8">
        <p className="font-display text-xs tracking-[0.3em] text-neon-magenta-glow mb-2">NEW USER</p>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Create your account</h1>
        <p className="text-ink-dim mb-6">Start your English course from A2 onward</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wide text-neon-cyan mb-1">
              Name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-neon-cyan/25 bg-void-2/60 px-4 py-2.5 text-white placeholder:text-ink-dim focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-neon-cyan mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neon-cyan/25 bg-void-2/60 px-4 py-2.5 text-white placeholder:text-ink-dim focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-neon-cyan mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-neon-cyan/25 bg-void-2/60 px-4 py-2.5 text-white placeholder:text-ink-dim focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition"
            />
            <p className="text-xs text-ink-dim mt-1">At least 6 characters</p>
          </div>

          {error && <p className="text-sm text-neon-magenta-glow">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-3d btn-3d-magenta w-full py-3 mt-2">
            {submitting ? 'Creating account…' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-ink-dim">
          Already have an account?{' '}
          <Link to="/login" className="text-neon-cyan-glow font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
