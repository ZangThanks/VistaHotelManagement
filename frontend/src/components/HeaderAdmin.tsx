/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import NotificationBell from './common/NotificationBell';

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
}) => {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                setUserData(user);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Lấy tên hiển thị (ưu tiên fullName, nếu không có thì dùng userName)
    const displayName =
        userData?.fullName || userData?.userName || 'Admin User';
    const displayRole =
        userData?.userRole === 'ADMIN'
            ? 'Administrator'
            : userData?.userRole || 'Administrator';

    return (
        <header className="bg-gradient-to-r from-white via-cream/30 to-white border-b-2 border-gold/20 py-1 px-6 shadow-md">
            <div className="flex justify-between items-center">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden text-gold hover:bg-gold/10 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                        aria-label="Toggle Sidebar"
                    >
                        <FaBars size={20} />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-1 bg-gradient-to-b from-gold to-primary rounded-full hidden sm:block"></div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
                                Vistal Hotel
                            </h1>
                            <p className="text-xs text-gray-500 hidden md:block">
                                Management System
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6">
                    {/* Notifications */}
                    <NotificationBell />

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
                            <p className="text-xs text-gray-500">
                                {displayRole}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default HeaderAdmin;
