import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { logout, refreshTokenAction } from "@/redux/slices/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert } from "lucide-react";

// Session configuration
const SESSION_DURATION = 13 * 60 * 1000; // 30 minutes in ms
const WARNING_THRESHOLD = 60 * 1000; // Warn 1 minute before expiration

export const SessionTimeoutManager = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken, refreshToken, tokenAcquiredAt } = useAppSelector((state) => state.auth);
  
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds warning countdown
  const [isRefreshing, setIsRefreshing] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!accessToken || !tokenAcquiredAt) {
      setIsOpen(false);
      return;
    }

    // Timer check function
    const checkSession = () => {
      const elapsed = Date.now() - tokenAcquiredAt;
      const remaining = SESSION_DURATION - elapsed;

      if (remaining <= WARNING_THRESHOLD) {
        // Compute precise countdown remaining in seconds
        const secRemaining = Math.max(0, Math.ceil(remaining / 1000));
        setCountdown(secRemaining);
        setIsOpen(true);

        if (remaining <= 0) {
          // Clear the interval first to prevent repeated calls
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Log out automatically if expired and no action taken
          handleAutoLogout();
        }
      } else {
        setIsOpen(false);
      }
    };

    // Run initial check and set interval
    checkSession();
    intervalRef.current = setInterval(checkSession, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, tokenAcquiredAt]);

  const handleAutoLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    toast.error("انتهت جلستك لعدم النشاط، يرجى تسجيل الدخول مرة أخرى.");
    navigate("/login");
  };

  const handleManualLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    toast.info("تم تسجيل الخروج بنجاح.");
    navigate("/login");
  };

  const handleRenewSession = async () => {
    if (!refreshToken) return;
    setIsRefreshing(true);
    try {
      const result = await dispatch(refreshTokenAction(refreshToken));
      if (result.success) {
        toast.success("تم تجديد الجلسة بنجاح ❤️");
        setIsOpen(false);
      } else {
        toast.error("فشل تجديد الجلسة، يرجى تسجيل الدخول مجدداً.");
        navigate("/login");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تجديد الجلسة.");
      console.log(error);
      navigate("/login");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing by clicking outside or pressing Escape to ensure session is renewed or logged out
      if (!open) return;
    }}>
      <DialogContent 
        className="max-w-md w-[95%] p-6 rounded-xl border border-zinc-200 bg-white/95 backdrop-blur-md shadow-2xl text-right"
        dir="rtl"
      >
        <DialogHeader className="flex flex-col items-center gap-4 text-center sm:text-center mt-2">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-full animate-bounce">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <DialogTitle className="text-xl font-bold text-zinc-900 font-sans w-full">
            تنبيه بانتهاء الجلسة
          </DialogTitle>
          <DialogDescription className="text-zinc-600 text-sm leading-relaxed mt-2">
            ستنتهي صلاحية جلستك الحالية قريباً بسبب عدم النشاط لضمان أمان حسابك.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 py-3 px-4 bg-zinc-50 border border-zinc-100 rounded-lg text-center">
          <span className="text-sm text-zinc-500">الوقت المتبقي: </span>
          <span className="text-base font-extrabold text-amber-600 font-mono">
            {countdown} ثانية
          </span>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row-reverse gap-3 mt-4 w-full justify-center">
          <Button
            onClick={handleRenewSession}
            disabled={isRefreshing}
            className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-primary/25 cursor-pointer"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التجديد...
              </>
            ) : (
              "تجديد الجلسة"
            )}
          </Button>
          <Button
            onClick={handleManualLogout}
            disabled={isRefreshing}
            variant="outline"
            className="w-full sm:w-auto border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium py-2 px-6 rounded-lg transition-all duration-200 cursor-pointer"
          >
            تسجيل الخروج
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
