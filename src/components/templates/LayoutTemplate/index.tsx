import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import ScrollToTop from "../../atoms/scrollToTop";
import OfflineBanner from "../../feedback/OfflineBanner";
import { isAuthPath, isDashboardPath } from "../../../utils/router.helper";
import Navbar from "@/components/organisms/navbar";
import Footer from "@/components/organisms/footer";
import DashbaordTemplate from "../DashboardTemplate";
import { useAppSelector } from "@/redux/store";

const LayoutTemplate = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { role } = useAppSelector((state) => state.auth);
  const [isOpenAside, setIsOpenAside] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setIsOpenAside(false);
    }
  }, [setIsMobile, setIsOpenAside]);

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
  }, [setIsMobile, setIsOpenAside]);

  const handleOpenAside = () => {
    console.log("open is : ", isOpenAside);
    setIsOpenAside(true);
  };

  const handleCloseAside = () => {
    console.log("open is : ", isOpenAside);
    setIsOpenAside(false);
  };

  if (isAuthPath(location.pathname)) {
    return (
      <article className="flex flex-col gap-20 bg-[#F8F9FF]">
        <ScrollToTop />
        <OfflineBanner />
        <Navbar />
        <div className="mt-20">{children}</div>
        <Footer />
      </article>
    );
  }

  if (
    (role === "admin" || role === "local_org") &&
    isDashboardPath(location.pathname)
  ) {
    return (
      <DashbaordTemplate
        handleCloseAside={handleCloseAside}
        handleOpenAside={handleOpenAside}
        isMobile={isMobile}
        isOpenAside={isOpenAside}
      >
        <ScrollToTop />

        {children}
      </DashbaordTemplate>
    );
  }

  return (
    <article className="">
      <ScrollToTop />
      <OfflineBanner />
      <Navbar />
      <div className="mt-20">{children}</div>
      <Footer />
    </article>
  );
};

export default LayoutTemplate;
