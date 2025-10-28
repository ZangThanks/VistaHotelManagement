import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CustomerList from '../pages/employee/CustomerList';
import NewsPage from '../pages/employee/NewsPage';
import AdminLayout from '../layouts/AdminLayout';

export const router = createBrowserRouter([
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },

            { path: "register", element: <Register /> },
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
        children: [
            { path: '', element: <CustomerList /> },
        ],
    },
    {
        path: '',
        element: <EmployeeLayout />,
        children: [{ path: '/newsPage', element: <NewsPage /> }],
    },
]);
