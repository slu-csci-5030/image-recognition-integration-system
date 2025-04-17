'use client';

import { useEffect, useState } from 'react';
import NavigationBar from '@/app/components/navigationBar';
import { AppConfig } from '@/types/config';
import { StatusBar } from '@capacitor/status-bar';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);

  

  useEffect(() => {
    
    fetch('./setup.json')
      .then((res) => res.json())
      .then(setConfig)
      .catch((error) => console.error('Config load failed:', error));

      
  }, []);

  useEffect(() => {
    if (!config) return;
    StatusBar.setOverlaysWebView({ overlay: false }); // Prevents content from going behind Dynamic Island
    StatusBar.setBackgroundColor({ color: `${config?.appBackground}` });
  }, [config]);
  

  return (
    <div className={`${config?.appBackground} ${config?.textColor} min-h-screen`}>
      <NavigationBar />
      {children}
    </div>
  );
}
