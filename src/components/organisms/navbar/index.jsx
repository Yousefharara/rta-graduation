import { NavLink } from "react-router-dom";
import { PATHS } from "../../../routes/paths";
// import Button from "../../atoms/button";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import "./style.css";
import { logout } from "../../../redux/slices/authSlice";

const Navbar = () => {
  const { role } = useAppSelector((state) => state.auth);

  console.log('Roles in nav is :, ', role);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="w-full bg-white z-20 sticky top-0 backdrop-blur-sm mx-auto border-b border-b-gray-300 px-[2rem] py-[.7rem] flex items-center justify-between">
      <ul className="flex gap-4 items-center">
        {role === "guest" && (
          <>
            <li>
              <NavLink to={PATHS.AUTH.LOGIN}>تسحيل الدخول</NavLink>
            </li>
          </>
        )}
        <li></li>
        {(role === "admin" || role === "user") && (
          <li>
            <button variant="destructive" size="small" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}

        {role === "guest" && (
          <li>
            <NavLink
              to={PATHS.DONATION}
              className={"not-active !text-white rounded-md px-4 py-2 bg-[#0048C1]"}
            >
              تبرع الان
            </NavLink>
          </li>
        )}
      </ul>
      <ul className="flex gap-4">
        {(role === "guest" || role === "user") && (
          <>
            <li>
              <NavLink to={PATHS.CONTACT_US}>تواصل معنا</NavLink>
            </li>

            <li>
              <NavLink to={PATHS.TRACK_AID}>تتبع المساعدات</NavLink>
            </li>
          </>
        )}
        <li>
          <NavLink to={PATHS.ABOUT}>حول المنصه</NavLink>
        </li>
        <li>
          <NavLink to={PATHS.HOME}>الرئيسية</NavLink>
        </li>
      </ul>

      <ul>
        <li className="w-28 h-full overflow-hidden">
          <img className="w-full h-full object-cover scale-125" src="/logo.png" alt="" />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
