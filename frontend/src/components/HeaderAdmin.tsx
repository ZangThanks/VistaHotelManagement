import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBell, FaBars } from "react-icons/fa";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const HeaderAdmin: React.FC<HeaderProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const notificationCount = 3;

  return (
    <header className="bg-white border-b border-cream py-3 px-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gold hover:text-gold/80 transition-colors"
        >
          <FaBars size={18} />
        </button>

        <div className="hidden sm:flex items-center text-xs text-gray-600">
          <Link to="/" className="hover:text-gold transition-colors">
            Dashboard
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-gold">Current Page</span>
        </div>
      </div>

      <div className="flex-1 mx-3 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-1.5 pl-8 pr-3 rounded-md border border-cream text-sm focus:border-gold focus:ring-1 focus:ring-gold/30 focus:outline-none transition-colors"
          />
          <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gold text-xs" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="text-gray-600 hover:text-gold transition-colors">
            <FaBell size={18} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXU1NT////R0dHV1dX09PTf39/8/Pzb29vu7u7x8fHl5eX5+fnc3Nzr6+vi4uLw8PCR9fa8AAAFQElEQVR4nO2d6ZKjMAyEjQzmSsj7v+2gMBnIHcCy2hl9Vbs/9qiaLtmSfDXOGYZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhGIZhbIOI/n59D97z76MmXw/dsS2Z9tgNtf/VOf2DvCFXd20fimtC33a1yzyYU3Sq5lbcQmZTLf5ljlDd9E/lTfRNnXEgq/KNvImy0v5Bt0HVu/AtAlllF0dPh7J4Pv9uCUVZU1aTkVzzsboLTU6Jdc0AncloqNKxWDFCL4z/45iHRPKfZdBHlD4DjVSvD98ikPDF0VO1Qx9ToefUvQJHidoSXkJV2DNGmRCgU+r+CIJHsY4isChqbSHP8Fvq/CN61GSzvQ7eUmpLeQh3MtEA7G58pCxzoQJc9++uE0tC0JZzB61fLr2mQRunh8gCi+KgLekaKmOOUSaUWEGMm2YmoFobilcKZ5CCuHvJ9BigIIqEECiIPlrHfUuNUvaj18ILODUxajszg9PYyOQZBiTX0ElM4QlkmMqMUQZjP6MTjGGnLY6hVkxgUbQIE5Fi7T89okdQ6AUFFoV+U+MF1r5LDgCNWyeqECDVRN1EvAdgW1Gs7Z4AaL4FezYGoG8TWv1eAFgFm0JTaAoBFEo23hCt9z+oh8Jdm75CN4gqHLTlCW4HTyBsCn/7+pDX+IL7NBBrfMlyEQCKheMlsFQQA8IC2P2H/VISnIcQg/Q/nFt8/dmT3NEMyMGM84JnwAgFn5E7x0fh2+9iOKlcA5NnnND5E0RP+kcVvXMLUCEUmYlIs3CEBO6XYin8B3eEKXJjEwBflMa+q4/Ht7+3YNa83n5FAH0zM7an0d494TSk11C0t2uYYzTGE9kJ5IeyUSRCvyHdLTGgC9z9EjgEtGbtDu/2vsfHnYN/7PJU0P7hP2NzdwPaydzjN3ubZBJCx+4fG/xpcnD9WMAeQ2so4XPoPcQ+WJ/k1cBeWPnp4+N3+tjri7K1bKP6+Nav7QjbZ3+Cd+QOp9eee5Rr+H7hwUrsm3gfvLarKd/heQP7XLL3ZdMyJ/a+/DKPzylSZ+dSOjuYum+JnWEYhmEYf0xlnr27L8x/lj+jDH/omrbvF9uMIfR923QH7zJXSZNZ+au109m2PFeV5IZ2Ctuz5dPv37YD4IHvS85dth/WbNSUg8+rG6f6hdX8k3hm5M1ONGw7Ku2HPGbktu3gX434e27TdvfWs5mAr5Hq/be/SuT5GOnCCeYBjeePBUS7i3EgD1c5KPqNIbRAstd8vJtt4ew/jxTFcYRGv0GLdRhF8V93haIDOjAV8jfByal0EnmfF2CePVEr9AAxYNz19qKmCi3CXBwjKPYAMRStsjovbalwvtGuGsZRoNwLUiYoX9pnywhphYrGEV72kfNMrbaBQ07SUHCmV+vChc13ZrTKorBvyxKlqbjrquw6gsbzBNle5pZSo7dJN0aZ9AYZ3qcbo0xI/lVd8W7tluStTZpavyRxshF2aXtEYjOe9CFMHMT4n5V5T9oPz9TCK4qHClMGUdh39hkpN6bSR5AJ6Upi2nZmJlljk7QjXZIs12jkGSZZrqGjmsJE+/yiH0N4TSLLGo1+5kKaYaqVSZkk2VQtkzJpsqlOmplI4lGnOQ3TTEQ5u9L3JDE0Tb59cU2CzQzVRJMm1ejVe6aXF+gVpyFPRPkVlOzHj94j/5lgWZP594jb0At//Og90ssLOb/ZTxH3pVXahJoR345SLofyBTHtqeFjhdKjVF+hrEBTaApzUJj+4PAa8WNEgIovrNCpd23SAhNehHrM6utRP3IESPnqlEjaAAAAAElFTkSuQmCC"
            alt="Profile"
            className="w-7 h-7 rounded-full object-cover border border-gold"
          />
          <span className="hidden md:block text-xs font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
