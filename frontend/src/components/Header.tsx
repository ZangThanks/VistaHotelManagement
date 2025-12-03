import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import MenuSidebar from "./MenuSidebar";
import SearchSidebar from "./SearchSidebar";
import { Link } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";

import type { NavItem } from "../types/Header";

const navItems: NavItem[] = [
  { label: "Overview", path: "/home" },
  { label: "About Us", path: "/contact" },
  { label: "Accommodation", path: "/customer/room" },
  { label: "Services", path: "/services" },
  { label: "Events", path: "/newsPage" },
  { label: "Exclusive Offers", path: "/customer/promotion/list" },
  { label: "My bookings", path: "/customer/mybooking" },
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

      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default Header;
