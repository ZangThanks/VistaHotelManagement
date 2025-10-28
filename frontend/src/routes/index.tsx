import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// Auth pages
import Login from "../pages/auth/Login";
import CustomerList from '../pages/employee/CustumerList';
import NewsPage from '../pages/employee/NewsPage';

export const router = createBrowserRouter([
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <Login /> },

            //   { path: "register", element: <Register /> },
            //   { path: "forgot-password", element: <ForgotPassword /> },
            //   { path: "reset-password", element: <ResetPassword /> },
        ],
    },
    {
        path: 'employee',
        element: <EmployeeLayout />,
        children: [
            { path: 'customer/list', element: <CustomerList /> },
        ],
    },
    {
        path: 'admin',
        element: <EmployeeLayout />,
        children: [
            { path: 'customer/list', element: <CustomerList /> },
        ],
    },
    {
        path: '',
        element: <EmployeeLayout />,
        children: [
            { path: '/newsPage', element: <NewsPage /> },
        ],
    },
]);
