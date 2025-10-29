import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// Auth pages
import Login from "../pages/auth/Login";
import CustomerList from '../pages/employee/CustomerList';
import NewsPage from '../pages/employee/NewsPage';
import AdminLayout from '../layouts/AdminLayout';
// import AppAdmin from '../pages/admin/appAdmin';
import Register from '../pages/auth/Register';
import Home from '../pages/customer/Home';
import MainLayout from '../layouts/MainLayout';

export const router = createBrowserRouter([
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },

            { path: 'register', element: <Register /> },
            //   { path: "forgot-password", element: <ForgotPassword /> },
            //   { path: "reset-password", element: <ResetPassword /> },
        ],
    },
    {
        path: 'employee',
        element: <EmployeeLayout />,
        children: [{ path: 'customer/list', element: <CustomerList /> }],
    },
    {
        path: 'admin',
        element: <AdminLayout />,
        children: [{ path: '', element: <CustomerList /> }],
    },
    {
        path: '',
        element: <MainLayout />,
        children: [
            { path: '/newsPage', element: <NewsPage /> },
            { path: '/home', element: <Home /> },
        ],
    },
]);
