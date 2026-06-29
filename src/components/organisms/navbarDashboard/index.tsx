import { PATHS } from "../../../routes/paths";
import { Link } from "react-router-dom";
import { AppWindowMac, Bell } from "lucide-react";
import logo from "@/assets/images/logo.png"

interface INavbarDashboard {
  handleOpenAside: () => void;
}

const NavbarDashboard = ({ handleOpenAside }: INavbarDashboard) => {


  return (
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
            <Bell />
          </li>
          </span>
        </div>
        <div>
          <div className="w-28 h-full overflow-hidden">
          <img className="w-full h-full object-cover scale-125" src={logo} alt="" />
        </div>
        </div>
      </ul>
    </nav>
  );
};

export default NavbarDashboard;
