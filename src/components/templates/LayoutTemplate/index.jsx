import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PATHS } from "../../../routes/paths";
import ScrollToTop from "../../atoms/scrollToTop";
import Navbar from "../../organisms/navbar";
import { isAuthPath } from "../../../utils/router.helper";
import DashbaordTemplate from "../DashboardTemplate";
import { useAppSelector } from "../../../redux/store";
import Footer from "../../organisms/footer";

const LayoutTemplate = ({ children }) => {
  const location = useLocation();
  const { role } = useAppSelector((state) => state.auth);
  const [isOpenAside, setIsOpenAside] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setIsOpenAside(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setIsOpenAside(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenAside = () => {
    console.log("open is : ", isOpenAside);
    setIsOpenAside(true);
  };

  const handleCloseAside = () => {
    console.log("open is : ", isOpenAside);
    setIsOpenAside(false);
  };

  if (location.pathname === PATHS.HOME) {
    return (
      <article className="min-h-screen flex flex-col justify-between">
        <ScrollToTop />
        <Navbar />
        {children}
        <Footer />
      </article>
    );
  }

  if (isAuthPath(location.pathname)) {
    return (
      <article className="flex flex-col gap-20 bg-[#F8F9FF]">
        <Navbar />
        {children}
        <Footer />
      </article>
    );
  }

  // if (role === "admin") {
  //   return (
  //     <DashbaordTemplate
  //       handleCloseAside={handleCloseAside}
  //       handleOpenAside={handleOpenAside}
  //       isMobile={isMobile}
  //       isOpenAside={isOpenAside}
  //     >
  //       {children}
  //     </DashbaordTemplate>
  //   );
  // }

  return (
    <article className="">
      <ScrollToTop />
      <Navbar />
      {children}
      <Footer />
    </article>
  );
};

export default LayoutTemplate;
