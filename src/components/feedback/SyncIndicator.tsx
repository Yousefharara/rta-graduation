import { useState, useEffect } from "react";
import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import { getPendingCount, isSyncing } from "@/lib/syncService";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const SyncIndicator = () => {
  const isOnline = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(getPendingCount());
  const [syncing, setSyncing] = useState(isSyncing());

  useEffect(() => {
    const updateCount = () => {
      setPendingCount(getPendingCount());
      setSyncing(isSyncing());
    };

    window.addEventListener("sync-queue-changed", updateCount);
    window.addEventListener("sync-status-changed", updateCount);

    const interval = setInterval(updateCount, 2000);

    return () => {
      window.removeEventListener("sync-queue-changed", updateCount);
      window.removeEventListener("sync-status-changed", updateCount);
      clearInterval(interval);
    };
  }, []);

  if (pendingCount === 0 && isOnline) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300 ${
        syncing
          ? "bg-blue-600 text-white"
          : isOnline
            ? "bg-amber-500 text-white"
            : "bg-red-500 text-white"
      }`}
    >
      {syncing ? (
        <>
          <RefreshCw size={16} className="animate-spin" />
          <span>جاري المزامنة...</span>
        </>
      ) : isOnline ? (
        <>
          <Wifi size={16} />
          <span>{pendingCount} عملية في انتظار المزامنة</span>
        </>
      ) : (
        <>
          <WifiOff size={16} />
          <span>غير متصل — {pendingCount} عملية محفوظة محلياً</span>
        </>
      )}
    </div>
  );
};

export default SyncIndicator;
