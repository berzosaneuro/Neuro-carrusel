import type { ReactNode } from 'react';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-bg">
      <div className="mx-auto w-full max-w-[480px] min-h-dvh sm:border-x border-border">
        {children}
      </div>
    </div>
  );
}
