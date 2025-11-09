import React from 'react';

const Header: React.FC = () => {
    return (
        <div className="relative flex items-center px-4 py-2 bg-[#F5F0EB] shadow">
            <img
                src="/src/assets/images/logo.png"
                alt="Company Logo"
                className="h-10 w-auto absolute left-1/2 -translate-x-1/2"
            />

            {/* Avatar bên phải */}
            <button
                aria-label="User profile"
                className="ml-auto rounded-full hover:opacity-80 transition"
            >
                <img
                    src="/src/assets/images/avt.png"
                    alt="User avatar"
                    className="h-10 w-10 rounded-full border"
                />
            </button>
        </div>
    );
};

export default Header;
