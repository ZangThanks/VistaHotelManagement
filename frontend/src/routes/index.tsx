import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

// Auth pages
import Login from "../pages/auth/Login";
import EmployeeLayout from '../layouts/EmployeeLayout';
import CustomerList from '../pages/employee/CustumerList';

export const router = createBrowserRouter([
    {
        path: '',
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
        element: <EmployeeLayout/>,
        children: [
            { path: 'customer/list', element: <CustomerList /> },

            //   { path: "register", element: <Register /> },
            //   { path: "forgot-password", element: <ForgotPassword /> },
            //   { path: "reset-password", element: <ResetPassword /> },
        ],
    },
]);
