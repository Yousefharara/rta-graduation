import { useEffect, useState } from "react";
import { BellDot, CheckCheck, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  getNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from "@/redux/slices/notificationSlice";

const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const notificationState = useAppSelector((state) => state.notifications);
  const notifications = Array.isArray(notificationState?.notifications) ? notificationState.notifications : [];
  const loading = notificationState?.loading ?? false;
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (accessToken) dispatch(getNotificationsAction(accessToken));
  }, [dispatch, accessToken, refreshKey]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = (id: number) => {
    if (accessToken) dispatch(markNotificationAsReadAction(id, accessToken));
  };

  const handleMarkAllAsRead = () => {
    if (accessToken) dispatch(markAllNotificationsAsReadAction(accessToken));
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <BellDot className="text-primary" size={24} />
          <h2 className="text-xl font-semibold">الإشعارات</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
              {unreadCount} غير مقروء
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-primary transition-colors cursor-pointer"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            تحديث
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <CheckCheck size={16} />
              تحديد الكل كمقروء
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-zinc-500">
          جاري تحميل الإشعارات...
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
          <BellDot size={60} strokeWidth={1} />
          <p>لا توجد إشعارات</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && handleMarkAsRead(n.id)}
              className={`flex items-start gap-3 p-4 rounded-lg border border-zinc-200 cursor-pointer transition-colors ${
                !n.is_read ? "bg-blue-50/60 border-primary/20" : "bg-white"
              }`}
            >
              <div
                className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  !n.is_read ? "bg-primary" : "bg-transparent"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-800">{n.title}</p>
                <p className="text-sm text-zinc-500 mt-1">{n.message}</p>
                <p className="text-xs text-zinc-400 mt-2">
                  {new Date(n.created_at).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NotificationsPage;
