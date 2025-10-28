import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

// Auth pages
import Login from "../pages/auth/Login";
<<<<<<<<< Temporary merge branch 1
import Register from "../pages/auth/Register";

import Home from "../pages/customer/Home";
import ServiceList from "../pages/customer/ServiceList";
import NewsPage from "../pages/employee/NewsPage";

export const router = createBrowserRouter([
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      //   { path: "forgot-password", element: <ForgotPassword /> },
      //   { path: "reset-password", element: <ResetPassword /> },
    ],
  },

  {
    path: "",
    element: <EmployeeLayout />,
    children: [
      { path: "", element: <NewsPage /> },
      { path: "service-list", element: <ServiceList /> },
      // { path: "register", element: <Register /> },
      //   { path: "forgot-password", element: <ForgotPassword /> },
      //   { path: "reset-password", element: <ResetPassword /> },
    ],
  },
=========
import EmployeeLayout from '../layouts/EmployeeLayout';
import CustomerList from '../pages/employee/CustumerList';
import NewsPage from '../pages/employee/NewsPage';
import AdminLayout from '../layouts/AdminLayout';

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
