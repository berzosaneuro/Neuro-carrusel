import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, loading, error, retry } = useAuth();

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center text-neon-cyan-glow font-display tracking-widest">
        LOADING…
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-neon-magenta-glow">{error ?? 'Something went wrong.'}</p>
        <button onClick={retry} className="btn-3d btn-3d-primary px-5 py-2.5 text-sm">
          RETRY
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
