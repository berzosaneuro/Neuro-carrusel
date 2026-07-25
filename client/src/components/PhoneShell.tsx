import type { ReactNode } from 'react';

export default function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center cyber-grid py-0">
      <div className="phone-shell">
        <div className="phone-notch" />
        <div className="phone-scroll">{children}</div>
      </div>
    </div>
  );
}
