import { useEffect, useState } from "react";
import { BellDot, Trash2, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  getNotificationsAction,
  markNotificationAsReadAction,
  deleteNotificationAction,
} from "@/redux/slices/notificationSlice";

const NotificationsPage = () => {
  const dispatch = useAppDispatch();
  const { accessToken, role } = useAppSelector((state) => state.auth);
  const { notifications, loading } = useAppSelector(
    (state) => state.notifications,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    if (accessToken) dispatch(getNotificationsAction(accessToken));
  }, [dispatch, accessToken, refreshKey]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = (id: number) => {
    if (accessToken) dispatch(markNotificationAsReadAction(id, accessToken));
  };

  const handleDelete = async (id: number) => {
    if (accessToken) {
      const result = await dispatch(deleteNotificationAction(id, accessToken));
      if (result?.success) {
        // notification removed from state
      }
    }
  };

  // const handleMarkAllAsRead = () => {
  //   if (accessToken) dispatch(markAllNotificationsAsReadAction(accessToken));
  // };

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
          {/* {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              <CheckCheck size={16} />
              تحديد الكل كمقروء
            </button>
          )} */}
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
              {role === "admin" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmId(n.id);
                  }}
                  title="حذف الإشعار"
                  className="shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <Trash2 className="text-red-600" size={22} />
              </div>
              <h2 className="text-lg font-semibold">حذف الإشعار</h2>
            </div>

            <p className="text-zinc-600 text-sm">
              هل أنت متأكد من حذف هذا الإشعار؟
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-zinc-300 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  const id = deleteConfirmId;
                  setDeleteConfirmId(null);
                  handleDelete(id);
                }}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm text-white font-medium bg-red-600 hover:bg-red-700 transition-colors cursor-pointer ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {loading ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NotificationsPage;
