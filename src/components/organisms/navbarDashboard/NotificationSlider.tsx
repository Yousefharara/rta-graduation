import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  X,
  BellDot,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  getNotificationsAction,
  markNotificationAsReadAction,
} from "@/redux/slices/notificationSlice";
import { PATHS } from "@/routes/paths";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const NotificationSlider = ({ open, setOpen }: Props) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { notifications } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    if (accessToken){
      dispatch(getNotificationsAction(accessToken));
      console.log('netifiy ....');
    }
  }, [open, accessToken, dispatch]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  );

  const handleMarkAsRead = (id: number) => {
    if (accessToken) dispatch(markNotificationAsReadAction(id, accessToken));
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <BellDot className="text-primary" size={20} />
            <h3 className="font-semibold text-lg">الإشعارات</h3>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="cursor-pointer p-1 hover:bg-zinc-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2 px-4">
              <BellDot size={40} strokeWidth={1} />
              <p className="text-sm">لا توجد إشعارات</p>
            </div>
          ) : (
            notifications.slice(0, 20).map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                className={`px-4 py-3 border-b flex gap-3 border-zinc-100 cursor-pointer hover:bg-zinc-50 transition-colors ${
                  !n.is_read ? "bg-blue-50/40" : ""
                }`}
              >
                <div
                className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  !n.is_read ? "bg-primary" : "bg-transparent"
                }`}
              />
                <div>
                  <p className="text-sm font-semibold text-zinc-800">{n.title}</p>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                  {n.message}
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  {new Date(n.created_at).toLocaleDateString("ar-SA", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                </div>
              </div>
            ))
          )}
        </div>

        <Link
          to={PATHS.DASHBOARD.NOTIFICATIONS}
          onClick={() => setOpen(false)}
          className="block text-center text-sm text-primary font-semibold border-t border-zinc-200 py-3 hover:bg-primary/5 transition-colors"
        >
          عرض كل الإشعارات
        </Link>
      </aside>
    </>
  );
};

export default NotificationSlider;
