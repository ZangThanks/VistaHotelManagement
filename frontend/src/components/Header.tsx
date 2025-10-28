import React from 'react';

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    return (
        <div className="relative flex items-center px-4 py-2 bg-[#F5F0EB] shadow">
            {/* Nút Menu bên trái */}
            <button
                onClick={onMenuClick}
                aria-label="Menu"
                className="text-2xl text-gray-800 hover:text-amber-700 transition duration-200"
            >
                <i className="fa-solid fa-bars"></i>
            </button>

            <button className="text-xl ml-2 text-gray-700 hover:opacity-75 transition">
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            {/* Logo ở giữa */}
            <img
                src="/src/assets/images/logo.png"
                alt="Company Logo"
                className=" w-13 absolute left-1/2 -translate-x-1/2"
            />

            {/* Avatar bên phải */}
            <button
                aria-label="User profile"
                className="ml-auto rounded-full hover:opacity-80 transition"
            >
                <img
                    src="/src/assets/images/avt.png"
                    alt="User avatar"
                    className="h-10 w-10 rounded-full"
                />
            </button>
        </div>
    );
};

export default Header;
