import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import CustomerLayout from "../layouts/CustomerLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Employee pages
import CustomerList from "../pages/employee/CustomerList";
import NewsPage from "../pages/employee/NewsPage";
import CheckInManager from "../pages/employee/CheckInManager";
import CheckOutManager from "../pages/employee/CheckOutManager";
import IncidentManagement from "../pages/employee/IncidentManagement";

// Admin pages
import BookingPage from "../pages/admin/booking/BookingPage";
import InfoManagement from "../pages/admin/infomation/InfoManagement";
import ServiceManagement from "../pages/admin/ServiceManagement";

// Customer pages
import Home from "../pages/customer/Home";
import RoomList from "../pages/customer/RoomList";
import RoomDetail from "../pages/customer/RoomDetail";
import IncidentReport from "../pages/customer/IncidentReport";

// Router configuration
export const router = createBrowserRouter([
    {
        path: "auth",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            // { path: "forgot-password", element: <ForgotPassword /> },
            // { path: "reset-password", element: <ResetPassword /> },
        ],
    },
    {
        path: "employee",
        element: <EmployeeLayout />,
        children: [
            { path: "customer/list", element: <CustomerList /> },
            { path: "incidents", element: <IncidentManagement /> },
            { path: "bookingPage", element: <BookingPage /> },
            { path: "newsPage", element: <NewsPage /> },
        ],
    },
    {
        path: "admin",
        element: <AdminLayout />,
        children: [
            { path: "", element: <CheckInManager /> },
            { path: "checkin", element: <CheckInManager /> },
            { path: "checkout", element: <CheckOutManager /> },
            { path: "info", element: <InfoManagement /> },
            { path: "services", element: <ServiceManagement /> },
            { path: "bookingPage", element: <BookingPage /> },
        ],
    },
    {
        path: "",
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "home", element: <Home /> },
            { path: "newsPage", element: <NewsPage /> },
            { path: "incident-report", element: <IncidentReport /> },
        ],
    },
    {
        path: "customer",
        element: <CustomerLayout />,
        children: [
            { path: "room", element: <RoomList /> },
            { path: "room/:id", element: <RoomDetail /> },
        ],
    },
]);
