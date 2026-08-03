import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, loading, error, retry } = useAuth();

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-border border-t-accent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-text-secondary">{error ?? 'Something went wrong.'}</p>
        <button onClick={retry} className="btn btn-primary px-5 py-2.5">
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
