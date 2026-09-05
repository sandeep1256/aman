import React from 'react';
import { WifiOff, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, t } = useApp();

  if (isOnline) return null;

  return (
    <div id="offline-status-banner" className="bg-stone-900 text-stone-200 border-b border-stone-800 px-4 py-2 text-[10px] uppercase tracking-widest font-bold flex items-center justify-between shadow-md z-50 sticky top-0">
      <div className="flex items-center gap-2">
        <WifiOff className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>{t.offlineNotice}</span>
      </div>
      <div className="flex items-center gap-1.5 bg-stone-800 px-2.5 py-1 text-[9px] text-[#D4AF37] font-mono">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
        <span>OFFLINE BROWSING ACTIVE</span>
      </div>
    </div>
  );
};
