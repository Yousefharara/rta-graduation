

const Sidebar = ({isOpenAside, isMobile, handleCloseAside}) => {
  return (
    <aside
      className={`border-r border-r-gray-300 transition-all duration-200 z-30 sticky bg-white p-4 top-0 h-screen overflow-y-auto basis-1/4 rounded-lg max-lg:-left-full max-lg:fixed
            ${isOpenAside && isMobile ? "max-lg:left-0 max-lg:w-1/3 max-lg:basis-0" : ""}`}
    >
      <div className="flex justify-between">
        <h1>Aside</h1>
        {isOpenAside && (
          <h3
            className="cursor-pointer text-gray-700"
            onClick={handleCloseAside}
          >
            {/* <X /> */}
          </h3>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
