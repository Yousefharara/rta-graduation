import { PATHS } from "../../../routes/paths";
import { Link } from "react-router-dom";
import { AppWindowMac, Bell, BellDot } from "lucide-react";
import logo from "@/assets/images/logo.png";
import { useState, useMemo } from "react";
import { useAppSelector } from "@/redux/store";
import NotificationSlider from "./NotificationSlider";

interface INavbarDashboard {
  handleOpenAside: () => void;
}

const NavbarDashboard = ({ handleOpenAside }: INavbarDashboard) => {
  const [openNotifications, setOpenNotifications] = useState(false);
  const notificationState = useAppSelector((state) => state.notifications);

  const unreadCount = useMemo(() => {
    const notifications = Array.isArray(notificationState?.notifications)
      ? notificationState.notifications
      : [];

    return notifications.filter((n) => !n.is_read).length;
  }, [notificationState.notifications]);

  return (
    <>
      <nav className="bg-white/80 border-b border-b-gray-300 rounded-lg sticky backdrop-blur-md top-0 z-20">
        <ul className="flex px-4 py-2 items-center justify-between">
          <div className="flex items-center gap-10">
            <div
              onClick={handleOpenAside}
              className={`cursor-pointer lg:hidden text-gray-600`}
            >
              <AppWindowMac />
            </div>
            <li>
              <Link to={PATHS.HOME}>الرئيسية</Link>
            </li>
            <span className="sm:flex gap-6 hidden">
              <li>
                <Link to={PATHS.ABOUT}>حول المنصة</Link>
              </li>
              <li>
                <button
                  onClick={() => setOpenNotifications(true)}
                  className="relative cursor-pointer"
                >
                  {unreadCount > 0 ? (
                    <>
                      <BellDot className="text-primary" size={22} />
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    </>
                  ) : (
                    <Bell size={22} />
                  )}
                </button>
              </li>
            </span>
          </div>
          <div>
            <div className="w-28 h-full overflow-hidden">
              <img
                className="w-full h-full object-cover scale-125"
                src={logo}
                alt=""
              />
            </div>
          </div>
        </ul>
      </nav>

      <NotificationSlider
        open={openNotifications}
        setOpen={setOpenNotifications}
      />
    </>
  );
};

export default NavbarDashboard;
