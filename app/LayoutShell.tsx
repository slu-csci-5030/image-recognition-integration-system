'use client';

import { useEffect, useState } from 'react';
import NavigationBar from '@/app/components/navigationBar';
import { AppConfig } from '@/types/config';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.json();
      })
      .then(setConfig)
      .catch((error) => console.error('Config load failed:', error));
  }, []);

  if (!config) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading configuration...</div>;

  return (
    <div className={`${config.appBackground} ${config.textColor} min-h-screen`}>
      <NavigationBar />
      {children}
    </div>
  );
}
