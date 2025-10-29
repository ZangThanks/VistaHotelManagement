/* eslint-disable*/
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
import { RiInfoCardFill } from "react-icons/ri";
import { IoBagCheckOutline } from "react-icons/io5";
import { LuMapPinCheckInside } from "react-icons/lu";
import { cn } from "../utils/cn";
import { MdRoomService } from "react-icons/md";
import { motion } from "framer-motion";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const expandTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const menuItems = [
    { icon: <FaTachometerAlt />, label: "Dashboard", path: "/" },
    {
      icon: <RiInfoCardFill />,
      label: "Information Management",
      path: "/admin/info",
    },
    {
      icon: <LuMapPinCheckInside />,
      label: "Check-in Management",
      path: "/admin/checkin",
    },
    {
      icon: <IoBagCheckOutline />,
      label: "Check-out Management",
      path: "/admin/checkout",
    },
    {
      icon: <FaCalendarAlt />,
      label: "Reservations",
      path: "/reservations",
    },
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
    <motion.aside
      ref={sidebarRef}
      animate={{ width: isExpanded ? 230 : 68 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className={cn(
        //linear-gradient(90deg,  45%,  80%)
        "h-screen bg-gradient-to-br from-[#f8ebd6]  to-[#ffffff] flex flex-col fixed z-30 shadow-lg pt-6",
        "border-r border-[#D9C9A8]/30",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="px-5 pb-6 flex items-center justify-center relative mb-2">
        <motion.div
          className="h-16 flex items-center justify-center"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          key={isExpanded ? "expanded" : "collapsed"}
        >
          {isExpanded ? (
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-playfair font-bold text-[#6B4B28]">
                VISTA
              </h2>
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-[#6B4B28]/70 to-transparent mt-1"></div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#6B4B28]/10 flex items-center justify-center">
              <img
                className="w-7 h-7"
                src="../../src/assets/images/logo.png"
                alt="Logo"
              />
            </div>
          )}
        </motion.div>
      </div>

      <nav className="flex-grow px-3 py-2 overflow-y-auto no-scrollbar">
        <motion.ul
          className="space-y-1.5"
          initial="closed"
          animate="open"
          variants={{
            open: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.01,
              },
            },
            closed: {},
          }}
        >
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.li
                key={index}
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 20 },
                }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 relative group",
                    isActive ? "bg-white shadow-md" : "hover:bg-white/60",
                    !isExpanded && "justify-center"
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg",
                      isActive
                        ? "text-[#6B4B28] "
                        : "text-[#6B4B28]/70 bg-transparent"
                    )}
                  >
                    {item.icon}
                  </motion.div>

                  {isExpanded ? (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.1,
                      }}
                      className="ml-3 font-medium text-sm text-[#6B4B28] whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{
                        opacity: 1,
                        scale: 1,
                      }}
                      className="absolute left-full ml-3 px-3 py-2 bg-white/95 shadow-lg rounded-lg opacity-0 invisible group-hover:visible whitespace-nowrap z-10 text-xs"
                    >
                      <div className="absolute -left-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white/95 rotate-45"></div>
                      <span className="text-[#6B4B28] font-medium">
                        {item.label}
                      </span>
                    </motion.div>
                  )}
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>

      <motion.div
        initial={false}
        animate={{
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? "auto" : 0,
        }}
        transition={{ duration: 0.2 }}
        className="p-4 mx-3 my-3 bg-[#F8EBD6]/50 rounded-xl mt-auto text-center overflow-hidden"
      >
        <p className="text-xs text-[#6B4B28]/70 font-medium">
          © 2025 Vista Hotel
        </p>
      </motion.div>

      <motion.button
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1.5 shadow-md border border-[#D9C9A8]/30 text-[#6B4B28]"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <FaChevronRight size={10} />
      </motion.button>
    </motion.aside>
  );
};

export default Sidebar;
