/* eslint-disable */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBell, FaBars, FaUserCircle, FaHome } from "react-icons/fa";
import Breadcrumb from "./common/Breadcrumb";
import type { BreadcrumbItem } from "./common/Breadcrumb";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface UserData {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  userRole: string;
  memberShipLevel?: string;
  avatarUrl?: string | null;
}

const HeaderAdmin: React.FC<HeaderProps> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  const notificationCount = 3;
  const [userData, setUserData] = useState<UserData | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserData(user);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Lấy tên hiển thị (ưu tiên fullName, nếu không có thì dùng userName)
  const displayName = userData?.fullName || userData?.userName || "Admin User";
  const displayRole =
    userData?.userRole === "ADMIN"
      ? "Administrator"
      : userData?.userRole || "Administrator";

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Dashboard", path: "/admin/dashboard", icon: null },
    ];

    let currentPath = "";
    pathnames.forEach((segment, index) => {
      if (segment === "admin") return; // Skip 'admin' segment

      currentPath += `/${segment}`;
      const isLast = index === pathnames.length - 1;

      // Format label
      let label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        path: isLast ? undefined : `/admin${currentPath}`,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  return (
    <header className="bg-gradient-to-r from-white via-cream/30 to-white border-b-2 border-gold/20 shadow-md">
      <div className="py-1 px-6">
        <div className="flex justify-between items-center">
          {/* Left Section - Breadcrumb */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gold hover:bg-gold/10 p-2 rounded-lg transition-all duration-200 cursor-pointer"
              aria-label="Toggle Sidebar"
            >
              <FaBars size={20} />
            </button>
            
            <div className="h-10 w-1 bg-gradient-to-b from-gold to-primary rounded-full hidden sm:block"></div>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative">
              <button
                className="relative text-gray-600 hover:text-gold transition-all duration-200 p-2 hover:bg-gold/10 rounded-lg group cursor-pointer"
                aria-label="Notifications"
              >
                <FaBell
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

            {/* Profile */}
            <Link
              to="/admin/profile"
              className="flex items-center gap-3 hover:bg-gold/10 px-3 py-2 rounded-lg transition-all duration-200 group cursor-pointer"
            >
              <div className="relative">
                {userData?.avatarUrl ? (
                  <img
                    src={userData.avatarUrl}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full border-2 border-gold object-cover group-hover:border-gold/70 transition-all"
                  />
                ) : (
                  <FaUserCircle
                    size={36}
                    className="text-gold group-hover:text-gold transition-colors"
                  />
                )}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 transition-colors">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500">{displayRole}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
