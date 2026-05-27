import NavbarDashboard from "@/components/organisms/navbarDashboard";
import Sidebar from "@/components/organisms/sidebar";
import type { ReactNode } from "react";

interface IDashbaordTemplate {
  handleCloseAside: () => void;
  handleOpenAside: () => void;
  isMobile: boolean;
  isOpenAside: boolean;
  children: ReactNode;
}

const DashbaordTemplate = ({
  children,
  handleCloseAside,
  isMobile,
  isOpenAside,
  handleOpenAside,
}: IDashbaordTemplate) => {
  return (
    <article className="flex gap-8 bg-[#F8F9FF] relative">
      {isOpenAside && isMobile && (
        <div
          onClick={handleCloseAside}
          className="absolute bg-black/40 w-full h-full z-20"
        />
      )}
      <Sidebar
        isOpenAside={isOpenAside}
        isMobile={isMobile}
        handleCloseAside={handleCloseAside}
      />
      <main className="w-full min-h-screen flex flex-col gap-4">
        <NavbarDashboard handleOpenAside={handleOpenAside} />
        <article className="w-full rounded-lg border min-h-screen p-4">
          {/* main content */}
          <div className="rounded-lg w-full h-[300vh] ">
            <h1>Dashboard</h1>
            {children}
          </div>
        </article>
      </main>
    </article>
  );
};

export default DashbaordTemplate;
