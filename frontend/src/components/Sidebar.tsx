/* eslint-disable */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaTachometerAlt,
    FaCalendarAlt,
    FaUsers,
    FaChartLine,
    FaCog,
} from "react-icons/fa";
import { MdMeetingRoom, MdRoomService, MdDiscount } from "react-icons/md";
import { RiInfoCardFill, RiDiscountPercentFill } from "react-icons/ri";
import { IoBagCheckOutline } from "react-icons/io5";
import { LuMapPinCheckInside } from "react-icons/lu";
import { BiSolidCategory, BiSolidDiscount } from "react-icons/bi";
import { AlertTriangle } from "lucide-react";
import { cn } from "../utils/cn";

import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface SidebarProps {
    className?: string;
    userRole?: "admin" | "employee";
}

const Sidebar: React.FC<SidebarProps> = ({ className, userRole = "admin" }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const location = useLocation();

    /** -------------------------------
     *  MENU ITEMS FOR ADMIN / EMPLOYEE
     * --------------------------------*/

    const adminMenuItems = [
        { icon: <FaTachometerAlt />, label: "Dashboard", path: "/admin/dashboard" },
        { icon: <MdMeetingRoom />, label: "Rooms", path: "/admin/room-management" },
        { icon: <BiSolidCategory />, label: "Room Types", path: "/admin/room-type-management" },
        { icon: <RiInfoCardFill />, label: "Information", path: "/admin/info" },
        { icon: <LuMapPinCheckInside />, label: "Check-in", path: "/admin/checkin" },
        { icon: <IoBagCheckOutline />, label: "Check-out", path: "/admin/checkout" },
        { icon: <FaCalendarAlt />, label: "Reservations", path: "/reservations" },
        { icon: <FaUsers />, label: "Guests", path: "/guests" },
        { icon: <MdRoomService />, label: "Services", path: "/admin/services" },
        { icon: <RiDiscountPercentFill />, label: "Promotions", path: "/admin/promotion-management" },
        { icon: <MdDiscount />, label: "Promotion Types", path: "/admin/promotion-type-management" },
        { icon: <BiSolidDiscount />, label: "Vouchers", path: "/admin/voucher-management" },
        { icon: <FaChartLine />, label: "Reports", path: "/admin/reports" },
        { icon: <FaCog />, label: "Settings", path: "/settings" },
    ];

    const employeeMenuItems = [
        { icon: <FaTachometerAlt />, label: "Daily Work", path: "/employee/daily" },
        { icon: <MdMeetingRoom />, label: "Rooms", path: "/employee/room-management" },
        { icon: <BiSolidCategory />, label: "Room Types", path: "/employee/room-type-management" },
        { icon: <RiInfoCardFill />, label: "Information", path: "/employee/newsPage" },
        { icon: <FaCalendarAlt />, label: "Reservations", path: "/employee/bookingPage" },
        { icon: <FaUsers />, label: "Guests", path: "/employee/customer/list" },
        { icon: <MdRoomService />, label: "Services", path: "/employee/service-orders" },
        { icon: <AlertTriangle />, label: "Incidents", path: "/employee/incidents" },
    ];

    const menuItems = userRole === "admin" ? adminMenuItems : employeeMenuItems;

    /** ----------------------------------
     *        HOVER EFFECT ANIMATION
     * ----------------------------------*/

    const getIconScale = (index: number) => {
        if (hoveredIndex === null) return 1;

        const distance = Math.abs(index - hoveredIndex);

        if (distance === 0) return 1.3;
        if (distance === 1) return 1.15;
        if (distance === 2) return 1.05;
        return 1;
    };

    const handleHoverStart = (index: number, event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPosition({
            top: rect.top + rect.height / 2,
            left: rect.right + 12,
        });
        setHoveredIndex(index);
    };

    return (
        <>
            {/* SIDEBAR */}
            <motion.aside
                className={cn(
                    "h-screen w-16 bg-gradient-to-br from-[#F8EBD6] via-[#F0E0C0] to-white",
                    "flex flex-col fixed z-30 shadow-lg pt-4 border-r border-[#D9C9A8]/30",
                    className
                )}
            >
                {/* LOGO (icon only) */}
                <div className="px-3 pb-4 flex items-center justify-center mb-1">
                    <div className="w-8 h-8 rounded-full bg-[#6B4B28]/10 flex items-center justify-center">
                        <img
                            className="w-5 h-5"
                            src="../../src/assets/images/logo.png"
                            alt="Logo"
                        />
                    </div>
                </div>

                {/* MENU ICONS */}
                <nav className="flex-grow px-2 py-1 overflow-y-auto no-scrollbar">
                    <ul className="space-y-1.5 flex flex-col items-center">
                        {menuItems.map((item, index) => {
                            const isActive = location.pathname === item.path;
                            const scale = getIconScale(index);

                            return (
                                <motion.li
                                    key={index}
                                    animate={{
                                        scale: scale,
                                        y: hoveredIndex === index ? -5 : 0,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 450,
                                        damping: 28,
                                    }}
                                    onMouseEnter={(e) => handleHoverStart(index, e)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className="relative"
                                >
                                    <Link
                                        to={item.path}
                                        className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                                            isActive ? "bg-white shadow-md" : "hover:bg-white/70 bg-white/30"
                                        )}
                                    >
                                        {/* Active left indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute -left-4 w-0.5 h-6 bg-[#6B4B28] rounded-r-full"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 30,
                                                }}
                                            />
                                        )}

                                        {/* Icon */}
                                        <motion.div
                                            className={cn(
                                                "text-base flex items-center justify-center",
                                                isActive ? "text-[#6B4B28]" : "text-[#6B4B28]/70"
                                            )}
                                        >
                                            {item.icon}
                                        </motion.div>
                                    </Link>
                                </motion.li>
                            );
                        })}
                    </ul>
                </nav>

                {/* FOOTER */}
                <div className="p-2 text-center mb-2">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-8 h-8 mx-auto rounded-full bg-[#6B4B28]/10 flex items-center justify-center cursor-pointer"
                    >
                        <span className="text-[10px] text-[#6B4B28]/70 font-bold">©</span>
                    </motion.div>
                </div>
            </motion.aside>

            {/* TOOLTIP FLOATING GLASS UI (portal) */}
            {createPortal(
                <AnimatePresence mode="wait">
                    {hoveredIndex !== null && (
                        <motion.div
                            key="tooltip"
                            initial={{ opacity: 0, x: -8, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -8, scale: 0.95 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                            }}
                            className="fixed pointer-events-none"
                            style={{
                                top: `${tooltipPosition.top}px`,
                                left: `${tooltipPosition.left}px`,
                                transform: "translateY(-50%)",
                                zIndex: 9999,
                            }}
                        >
                            <div className="relative">
                                {/* Background glass */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-[#F8EBD6]/95 backdrop-blur-xl rounded-xl shadow-xl border border-[#D9C9A8]/40"></div>

                                {/* Content */}
                                <div className="relative px-4 py-2.5 rounded-xl">
                  <span className="text-sm font-semibold text-[#6B4B28] whitespace-nowrap">
                    {menuItems[hoveredIndex].label}
                  </span>
                                </div>

                                {/* Arrow */}
                                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2">
                                    <div className="w-3 h-3 bg-white/95 border-l border-b border-[#D9C9A8]/40 rotate-45"></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default Sidebar;
