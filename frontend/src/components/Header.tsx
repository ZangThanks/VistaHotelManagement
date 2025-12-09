import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuSidebar from "./MenuSidebar";
import SearchSidebar from "./SearchSidebar";
import { Link, useNavigate } from "react-router-dom";
import {
  faUser,
  faUserCircle,
  faBookmark,
  faSignOutAlt,
  faChartLine,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import { CiShoppingCart, CiSearch, CiMenuBurger } from "react-icons/ci";
import { handleLogout } from "../services/authService";
import ConfirmDialog from "./dialog/ConfirmDialog";
import { useToastContext } from "../hooks/useToastContext";

import type { NavItem } from "../types/Header";
interface User {
  id: string;
  userName: string;
  fullName?: string;
  email: string;
  userRole?: string;
  avatarUrl?: string | null;
}

const navItems: NavItem[] = [
  { label: "Overview", path: "/home" },
  { label: "About Us", path: "/contact" },
  { label: "Accommodation", path: "/customer/room/list" },
  { label: "Services", path: "/services" },
  { label: "Events", path: "/newsPage" },
  { label: "Exclusive Offers", path: "/promotion-and-voucher" },
  { label: "My bookings", path: "/customer/mybooking" },
];

// Menu items based on user role
const roleMenuItems = {
  ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard", icon: faChartLine },
    {
      label: "Management",
      path: "/admin/room-management",
      icon: faTasks,
    },
    { label: "Profile", path: "/customer/profile", icon: faUserCircle },
  ],
  EMPLOYEE: [
    {
      label: "Dashboard",
      path: "/employee/dashboard",
      icon: faChartLine,
    },
    {
      label: "Booking Management",
      path: "/employee/booking-management",
      icon: faTasks,
    },
    { label: "Profile", path: "/customer/profile", icon: faUserCircle },
  ],
  CUSTOMER: [
    { label: "Profile", path: "/customer/profile", icon: faUserCircle },
    {
      label: "My Booking",
      path: "/customer/mybooking",
      icon: faBookmark,
    },
  ],
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const toast = useToastContext();

  // Check user login status
  useEffect(() => {
    const checkUserStatus = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
      }
    };

    checkUserStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkUserStatus);
    
    // Listen for custom event when user data is updated in the same tab
    window.addEventListener("userDataUpdated", checkUserStatus);
    
    return () => {
      window.removeEventListener("storage", checkUserStatus);
      window.removeEventListener("userDataUpdated", checkUserStatus);
    };
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    const result = handleLogout();
    if (result.success) {
      toast.success(result.message || "Logged out successfully!");
    }
    setShowLogoutDialog(false);
    navigate("/auth/login");
  };
  const getLastTwoWords = (name: string): string => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length <= 2) return name; // Nếu tên chỉ có 1–2 từ thì giữ nguyên
    return parts.slice(-2).join(" "); // Lấy 2 từ cuối
  };

  return (
    <div className="relative flex items-center px-6 py-4 bg-[#F5F0EB] shadow">
      <button
        onClick={() => setMenuOpen(true)}
        className="text-2xl text-black hover:text-amber-400 transition"
      >
        <CiMenuBurger className="cursor-pointer text-black text-2xl hover:opacity-80 transition" />
      </button>

      <button
        onClick={() => setSearchOpen(true)}
        className="ml-3 text-xl text-black hover:text-amber-400 transition"
      >
        <CiSearch className="cursor-pointer ml-1 text-black text-2xl hover:opacity-80 transition" />
      </button>

      <Link to="/home" className="absolute left-1/2 -translate-x-1/2">
        <img
          src="/src/assets/images/logo.png"
          className="w-13 cursor-pointer"
          alt="logo"
        />
      </Link>

      <div className="ml-auto relative group">
        <button className="flex items-center text-black hover:opacity-80 transition">
          <FontAwesomeIcon
            icon={faUser}
            className="cursor-pointer text-black text-xl"
          />
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-black/50 backdrop-blur-md rounded-md shadow-lg ring-1 ring-white/10 py-1 z-50 opacity-0 invisible scale-95 transform transition-all duration-300 ease-out group-hover:opacity-100 group-hover:visible group-hover:scale-100">
          {user ? (
            // Logged in user menu
            <>
              <div className="px-4 py-2 border-b border-white/10 flex items-center">
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <p className="text-sm text-white font-serif">
                  Hello, {getLastTwoWords(user.fullName || user.userName)}
                </p>
              </div>

              {user.userRole &&
                roleMenuItems[user.userRole as keyof typeof roleMenuItems]?.map(
                  (item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 font-serif transition"
                    >
                      <FontAwesomeIcon icon={item.icon} className="mr-2 w-4" />
                      {item.label}
                    </Link>
                  )
                )}

              <button
                onClick={handleLogoutClick}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 font-serif transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 w-4" />
                Logout
              </button>
            </>
          ) : (
            // Not logged in menu
            <>
              <Link
                to="/auth/login"
                className="block px-4 py-2 text-sm text-white hover:bg-white/10 font-serif transition"
              >
                Login
              </Link>

              <Link
                to="/auth/register"
                className="block px-4 py-2 text-sm text-white hover:bg-white/10 font-serif transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {user && (
        <Link to="/customer/cart">
          <CiShoppingCart className="ml-4 text-black text-2xl hover:opacity-80 transition" />
        </Link>
      )}

      <MenuSidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
      />

      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from your account?"
        type="warning"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Header;
