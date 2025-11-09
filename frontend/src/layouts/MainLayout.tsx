import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const MainLayout: React.FC = () => {
    return (
        <div>
            <div>
                <Outlet />
            </div>
            <div >
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
