import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const HeaderHome: React.FC = () => {
    const navItems = [
        { label: 'Overview', path: '/home' },
        { label: 'About Us', path: '/contact' },
        { label: 'Accommodation', path: '/room' },
        { label: 'Services', path: '/services' },
        { label: 'Events', path: '/newsPage' },
        { label: 'Exclusive Offers', path: '/customer/promotion/list' },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-[9999]">
            {/* Top Section */}
            <div className="relative flex items-center justify-between px-8 py-4 border-b border-white/20">
                {/* Left: Search Icon */}
                <div className="flex items-center z-10">
                    <button className="hover:opacity-80 transition-opacity">
                        <i className="fa-solid fa-magnifying-glass text-xl text-white"></i>
                    </button>
                </div>

                {/* Center: Logo */}
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                    <a
                        href="/"
                        className="text-5xl text-white font-serif tracking-[0.4em] font-light"
                    >
                        VISTA
                    </a>
                </div>

                {/* Right: EN / User / Reserve */}
                <div className="flex items-center space-x-6 z-10">
                    {/* Language Dropdown */}
                    <div className="relative group">
                        <div className="flex items-center space-x-1 cursor-pointer py-2">
                            <span className=" text-white font-serif">EN</span>
                            <i className="fa-solid fa-chevron-down text-white text-xs transition-transform duration-300 group-hover:rotate-180"></i>
                        </div>

                        {/* Dropdown */}

                        <div className="absolute right-0 top-full mt-2 w-40 bg-black/50 backdrop-blur-md rounded-md shadow-lg ring-1 ring-white/10 py-1 z-50 opacity-0 invisible scale-95 transform transition-all duration-300 ease-out group-hover:opacity-100 group-hover:visible group-hover:scale-100">
                            <Link
                                to="/auth/login"
                                className="block px-4 py-2 text-sm text-white hover:bg-white/10 font-serif transition"
                            >
                                English (EN)
                            </Link>

                            <Link
                                to="/auth/login?lang=vi"
                                className="block px-4 py-2 text-sm text-white hover:bg-white/10 font-serif transition"
                            >
                                Vietnamese (VI)
                            </Link>
                        </div>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center text-white hover:opacity-80 transition">
                            <FontAwesomeIcon
                                icon={faUser}
                                className=" text-white"
                            />
                        </button>
                        <div className="absolute right-0 mt-2 w-40 bg-black/50 backdrop-blur-md rounded-md shadow-lg ring-1 ring-white/10 py-1 z-50 opacity-0 invisible scale-95 transform transition-all duration-300 ease-out group-hover:opacity-100 group-hover:visible group-hover:scale-100">
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
                        </div>
                    </div>

                    {/* Reserve Button */}
                    <Link
                        to="/customer/bookingPage"
                        className="bg-white text-black px-6 py-2 rounded font-serif border border-transparent hover:bg-black/40 hover:text-white transition-all duration-300 ease-in-out"
                    >
                        Reserve
                    </Link>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex justify-center space-x-12 px-8">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className="group relative text-white py-4 px-6 font-serif text-lg"
                    >
                        {item.label}
                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-white transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                    </Link>
                ))}
            </nav>
        </header>
    );
};

export default HeaderHome;
