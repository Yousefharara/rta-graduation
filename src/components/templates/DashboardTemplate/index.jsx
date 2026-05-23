import React from 'react';
import Sidebar from '../../organisms/sidebar';
import NavbarDashboard from '../../organisms/navbarDashboard';

const DashbaordTemplate = ({children, handleCloseAside, isMobile, isOpenAside, handleOpenAside}) => {
    return (
      <article className="flex gap-8 bg-gray-100 relative">
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
          <article className="w-full rounded-lg bg-white min-h-screen p-4">
            {/* main content */}
            <div className="rounded-lg w-full h-[300vh] ">
              <h1>Dashboard</h1>
              {children}
            </div>
          </article>
        </main>
      </article>
    );
}

export default DashbaordTemplate;
