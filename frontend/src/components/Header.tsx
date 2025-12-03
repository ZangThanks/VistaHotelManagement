import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import MenuSidebar from "./MenuSidebar";
import SearchSidebar from "./SearchSidebar";

import type { NavItem } from "../types/Header";

const navItems: NavItem[] = [
    { label: "Overview", path: "/home" },
    { label: "About Us", path: "/contact" },

    // Accommodation
    { label: "Accommodation", path: "/customer/room" },

    // Services (GIỮ TỪ HEAD)
    { label: "Services", path: "/customer/service" },

    // Incident Report (GIỮ TỪ HEAD)
    { label: "Incident Report", path: "/incident-report" },

    // Events (GIỮ TỪ HEAD)
    { label: "Events", path: "/news" },

    // Promotions
    { label: "Exclusive Offers", path: "/customer/promotion/list" },

    // My bookings (GIỮ TỪ HEAD)
    { label: "My bookings", path: "/customer/booking/mybookings" },
];

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <div className="relative flex items-center px-6 py-4 bg-[#F5F0EB] shadow">
            <button
                onClick={() => setMenuOpen(true)}
                className="text-2xl text-black hover:text-amber-400 transition"
            >
                <FontAwesomeIcon icon={faBars} />
            </button>

            <button
                onClick={() => setSearchOpen(true)}
                className="ml-3 text-xl text-black hover:text-amber-400 transition"
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>

            <Link to="/home" className="absolute left-1/2 -translate-x-1/2">
                <img
                    src="/src/assets/images/logo.png"
                    className="w-13 cursor-pointer"
                    alt="logo"
                />
            </Link>

            <div className="ml-auto">
                <button className="flex items-center text-black hover:opacity-80 transition">
                    <FontAwesomeIcon icon={faUser} className=" text-black text-2xl" />
                </button>
            </div>

            <Link to="/customer/cart">
                <CiShoppingCart className="ml-4 text-black text-3xl hover:opacity-80 transition" />
            </Link>

            <MenuSidebar
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                navItems={navItems}
            />

            <SearchSidebar
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
            />
        </div>
    );
};

export default Header;
