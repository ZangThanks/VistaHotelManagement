import React from 'react';
import { Outlet } from 'react-router-dom';
import bgImage from '../assets/images/resort-bg.png';

const AuthLayout: React.FC = () => {
    return (
        <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"></div>

            {/* Main content - with opacity to see background */}
            <div className="relative z-10 w-full max-w-lg bg-gray-600/45 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] m-4">
                <div className="h-full overflow-y-auto scrollbar-thin p-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
