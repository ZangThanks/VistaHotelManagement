import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBed,
  FaCalendarAlt,
  FaUsers,
  FaChartLine,
  FaCog,
  FaChevronRight,
} from "react-icons/fa";
import { cn } from "../utils/cn";
import { MdRoomService } from "react-icons/md";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const expandTimeout = useRef<NodeJS.Timeout | null>(null);
  const collapseTimeout = useRef<NodeJS.Timeout | null>(null);

  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "/" },
    { icon: <FaBed />, label: "Room Management", path: "/info-management" },
    { icon: <FaCalendarAlt />, label: "Reservations", path: "/reservations" },
    { icon: <FaUsers />, label: "Guests", path: "/guests" },
    { icon: <MdRoomService />, label: "Services", path: "/services" },
    { icon: <FaChartLine />, label: "Reports", path: "/reports" },
    { icon: <FaCog />, label: "Settings", path: "/settings" },
  ];

  const handleMouseEnter = () => {
    if (collapseTimeout.current) {
      clearTimeout(collapseTimeout.current);
      collapseTimeout.current = null;
    }

    expandTimeout.current = setTimeout(() => {
      setIsExpanded(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (expandTimeout.current) {
      clearTimeout(expandTimeout.current);
      expandTimeout.current = null;
    }

    collapseTimeout.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (expandTimeout.current) clearTimeout(expandTimeout.current);
      if (collapseTimeout.current) clearTimeout(collapseTimeout.current);
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "h-screen bg-gradient-to-b from-[#F8EBD6] to-white flex flex-col fixed z-30 transition-all duration-300 shadow-md",
        isExpanded ? "w-64" : "w-20",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "p-6 border-b border-white/20 flex items-center justify-center overflow-hidden",
          isExpanded ? "justify-start" : "justify-center"
        )}
      >
        {isExpanded ? (
          <div>
            <h2 className="text-2xl font-playfair font-bold text-black">
              VISTA
            </h2>
            <p className="text-xs text-black">Hotel Management</p>
          </div>
        ) : (
          <img
            className="text-2xl font-playfair font-bold text-black"
            src="../../src/assets/images/logo.png"
          ></img>
        )}
      </div>

      <nav className="flex-grow py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
        <ul>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-6 py-4 hover:bg-white/10 transition-all duration-200 relative group",
                    isActive ? "bg-white/10 border-l-4 border-white" : "",
                    !isExpanded && "justify-center"
                  )}
                >
                  <span
                    className={cn(
                      "text-black text-lg",
                      isActive ? "text-black" : "text-black/80"
                    )}
                  >
                    {item.icon}
                  </span>

                  {isExpanded ? (
                    <span className="ml-3 text-black whitespace-nowrap">
                      {item.label}
                    </span>
                  ) : (
                    <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-cream shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={cn(
          "p-4 border-t border-white/20 mt-auto text-center",
          isExpanded ? "block" : "hidden"
        )}
      >
        <p className="text-xs text-white/80">© 2023 Vista Hotel</p>
      </div>

      <button
        className={cn(
          "absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md text-gold",
          "transition-transform duration-300",
          isExpanded ? "rotate-180" : "rotate-0"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaChevronRight size={12} />
      </button>
    </aside>
  );
};

export default Sidebar;
