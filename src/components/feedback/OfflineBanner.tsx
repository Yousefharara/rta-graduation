import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const OfflineBanner = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2 text-sm font-medium">
      <WifiOff size={18} />
      <span>أنت غير متصل بالإنترنت. سيتم مزامنة العمليات تلقائياً عند عودة الاتصال.</span>
    </div>
  );
};

export default OfflineBanner;
