import { NavLink } from "react-router-dom";
import { PATHS } from "../../../routes/paths";
import Button from "../../atoms/button";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { logout } from "../../../redux/slices/authSlice";
import "./style.css";

const Navbar = () => {
  const { role } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="w-full z-20 sticky top-0 backdrop-blur-sm mb-4 mx-auto border-b border-b-gray-300 px-[2rem] py-[.7rem] flex items-center justify-between">
      <ul className="flex gap-4">
        {role === "user" && (
          <>
            <li>
              <NavLink to={PATHS.HOME}>Home</NavLink>
            </li>
            <li>
              <NavLink to={PATHS.ABOUT}>About</NavLink>
            </li>
            <li>
              <NavLink to={PATHS.POST.ROOT}>Post</NavLink>
            </li>
            <li>
              <NavLink to={PATHS.POST.CREATE_POST}>Create Post</NavLink>
            </li>
          </>
        )}
      </ul>
      <ul className="flex gap-4 items-center">
        {role === "guest" && (
          <>
            <li>
              <NavLink to={PATHS.AUTH.LOGIN}>Login</NavLink>
            </li>
            <li>
              <NavLink to={PATHS.AUTH.SIGNUP}>Signup</NavLink>
            </li>
          </>
        )}
        <li></li>
        {(role === "admin" || role === "user") && (
          <li>
            <Button variant="destructive" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
