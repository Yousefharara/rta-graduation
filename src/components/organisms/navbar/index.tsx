import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import "./style.css";
import { logout } from "../../../redux/slices/authSlice";
import { PATHS } from "@/routes/paths";
import Button from "@/components/atoms/button";
import logo from '@/assets/images/logo.png'
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

const mobileRange = 768;
const Navbar = () => {

  const { role } = useAppSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < mobileRange) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen])

  useEffect(() => {
    if (window.innerWidth <= mobileRange) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [])

  useEffect(() => {
    console.log("is open , ", isOpen);

  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleToggle = () => {
    setIsOpen(prev => !prev)
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  return (

    <nav className="w-full bg-white z-20 fixed top-0 backdrop-blur-sm mx-auto border-b border-b-gray-300 px-8 py-[.7rem] flex items-center justify-between">

      <div
        id="navBgMobile"
        onClick={handleClose}
        className={`${isOpen ? "block" : "hidden"} z-20 fixed left-0 top-0 w-full h-screen bg-black/90 md:hidden`}
      ></div>

      <ul className={`z-50 ${isMobile ? "block" : "hidden"} cursor-pointer`} onClick={handleToggle}>
        <li><Menu className={`${isOpen ? "text-white" : "text-primary"}`} /></li>
      </ul>

      <article
        className={`${isOpen ? "translate-x-0" : "translate-x-full"} z-40 fixed flex text-white w-[50%] pt-20 gap-4 h-screen bg-primary-foreground flex-col right-0 top-0 basis-[85%]
      lg:basis-[70%]
      md:relative md:justify-between md:gap-0 md:flex-row md:right-auto md:top-auto md:bg-transparent
      md:h-fit md:w-fit md:pt-0 md:text-inherit md:translate-x-0`}>

        <ul className={`flex flex-col gap-4 items-center
          md:flex-row`}>
          {role === "guest" && (
            <>
              <li>
                <NavLink onClick={handleClose} to={PATHS.AUTH.LOGIN}>تسحيل الدخول</NavLink>
              </li>
            </>
          )}
          {(role !== 'guest') && (
            <li>
              <Button onClick={() => {
                handleClose();
                handleLogout();
              }} variant="destructive" size="medium">
                Logout
              </Button>
            </li>
          )}

          {role === "guest" && (
            <li>
              <NavLink
                to={PATHS.DONATION}
                onClick={handleClose}
                className={"not-active text-white! rounded-md px-4 py-2 bg-blue-primary"}
              >
                تبرع الان
              </NavLink>
            </li>
          )}
        </ul>
        <ul className={`flex flex-col items-center gap-4 md:flex-row md:items-start`}>
          {(role === "guest" || role === "user") && (
            <>
              <li>
                <NavLink onClick={handleClose} to={PATHS.CONTACT_US}>تواصل معنا</NavLink>
              </li>

              <li>
                <NavLink onClick={handleClose} to={PATHS.TRACK_AID.ROOT}>تتبع المساعدات</NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink onClick={handleClose} to={PATHS.ABOUT}>حول المنصه</NavLink>
          </li>
          <li>
            <NavLink onClick={handleClose} to={PATHS.HOME}>الرئيسية</NavLink>
          </li>
        </ul>


      </article>

      <ul>
        <li className="w-28 h-full overflow-hidden">
          <img className="w-full h-full object-cover scale-125" src={logo} alt="" />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
