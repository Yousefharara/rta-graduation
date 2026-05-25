// import { AppWindowMac } from "lucide";
import React from "react";
import { PATHS } from "../../../routes/paths";
import { Link } from "react-router-dom";


const NavbarDashboard = ({ handleOpenAside }) => {



  return (
    <nav className="bg-white/80 border-b border-b-gray-300 rounded-lg sticky backdrop-blur-md top-0">
      <ul className="flex px-4 py-2 items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            onClick={handleOpenAside}
            className={`cursor-pointer lg:hidden text-gray-600`}
          >
            {/* <AppWindowMac /> */}
          </div>
          <li>
            <Link to={PATHS.HOME}>Home</Link>
          </li>
        </div>
        <div>
          {/* <Button variant="destructive" size="small" onClick={handleLogout}> */}
            <button>Logout</button>
          {/* </Button> */}
        </div>
      </ul>
    </nav>
  );
};

export default NavbarDashboard;
