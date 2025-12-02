import { createBrowserRouter } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
// import CustomerLayout from "../layouts/CustomerLayout";

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import CustomerList from '../pages/employee/CustomerList';
import NewsPage from '../pages/employee/NewsPage';
import AdminLayout from '../layouts/AdminLayout';
import BookingPage from '../pages/admin/booking/BookingPage';
import MainLayout from '../layouts/MainLayout';
import CheckInManager from '../pages/employee/CheckInManager';
import CheckOutManager from '../pages/employee/CheckOutManager';
import IncidentManagement from '../pages/employee/IncidentManagement';
import ServiceOrderManagement from '../pages/employee/ServiceOrderManagement';

import Home from '../pages/customer/Home';
import RoomList from '../pages/customer/RoomList';
import Dashboard from '../pages/admin/dashboard/Dashboard.tsx';
import NewsDetail from '../components/news/NewsDetail.tsx';
import RoomManagement from '../pages/admin/room/RoomManagement.tsx';
import RoomDetail from '../pages/customer/RoomDetail.tsx';
import CustomerLayout from '../layouts/CustomerLayout.tsx';
import DailyWorkStatistics from '../pages/employee/DailyWorkStatistics.tsx';
import NewsList from '../pages/admin/infomation/NewsList.tsx';
import ServiceList from '../pages/customer/ServiceList.tsx';
import IncidentReport from '../pages/customer/IncidentReport.tsx';
import ServiceManagement from '../pages/admin/ServiceManagement.tsx';
import BookingDetail from '../pages/admin/booking/BookingDetail.tsx';
import { Contact } from 'lucide-react';

export const router = createBrowserRouter([
    // AUTH
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'reset-password', element: <ResetPassword /> },
        ],
    },

    // EMPLOYEE
    {
        path: 'employee',
        element: <EmployeeLayout />,
        children: [
            { path: 'customer/list', element: <CustomerList /> },
            { path: 'incidents', element: <IncidentManagement /> },
            { path: 'bookingPage', element: <BookingPage /> },
            { path: 'newsPage', element: <NewsPage /> },
            { path: 'daily', element: <DailyWorkStatistics /> },
            { path: 'services', element: <ServiceManagement /> },
            { path: 'service-orders', element: <ServiceOrderManagement /> },
        ],
    },

    // ADMIN
    {
        path: 'admin',
        element: <AdminLayout />,
        children: [
            { path: '', element: <Dashboard /> },
            { path: 'checkin', element: <CheckInManager /> },
            { path: 'checkout', element: <CheckOutManager /> },
            { path: 'info', element: <NewsList /> }, // NewsList thay InfoManagement
            { path: 'info/manage', element: <NewsList /> }, // nếu bạn cần InfoManagement
            { path: 'info/:id', element: <NewsDetail /> },
            { path: 'services', element: <ServiceManagement /> },
            { path: 'room-management', element: <RoomManagement /> },
            { path: 'bookingPage', element: <BookingPage /> },
        ],
    },

    // MAIN USER AREA
    {
        path: '',
        element: <MainLayout />,
        children: [
            { path: '/', element: <Home /> },
            { path: 'home', element: <Home /> },
            { path: 'newsPage', element: <NewsPage /> },
            { path: 'incident-report', element: <IncidentReport /> },
            { path: '/contact', element: <Contact /> },
            { path: '/bookingPage', element: <BookingPage /> },
            { path: 'room', element: <RoomList /> },
            { path: 'room/:id', element: <RoomDetail /> },
            { path: 'service', element: <ServiceList /> },
        ],
    },

    // CUSTOMER
    {
        path: 'customer',
        element: <CustomerLayout />,
        children: [
            { path: 'room', element: <RoomList /> },
            { path: 'room/:id', element: <RoomDetail /> },
            { path: 'service', element: <ServiceList /> },
            { path: 'bookingPage', element: <BookingPage /> },
            { path: 'booking/:id', element: <BookingDetail /> },
        ],
    },
]);
