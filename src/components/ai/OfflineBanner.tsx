import React from 'react';
import { WifiOff, AlertTriangle } from "lucide-react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white p-3 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
      <WifiOff className="w-5 h-5 animate-pulse" />
      <div className="text-sm font-bold uppercase tracking-tight">
        You are offline. Showing last saved data from field.
      </div>
      <AlertTriangle className="w-5 h-5" />
    </div>
  );
}
