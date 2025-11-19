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
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Employee pages
import CustomerList from "../pages/employee/CustomerList";
import NewsPage from "../pages/employee/NewsPage";
import CheckInManager from "../pages/employee/CheckInManager";
import CheckOutManager from "../pages/employee/CheckOutManager";
import IncidentManagement from "../pages/employee/IncidentManagement";
import DailyWorkStatistics from "../pages/employee/DailyWorkStatistics";

// Admin pages
import BookingPage from "../pages/admin/booking/BookingPage";
import InfoManagement from "../pages/admin/infomation/NewsList";
import NewsList from "../pages/admin/infomation/NewsList";
import ServiceManagement from "../pages/admin/ServiceManagement";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import RoomManagement from "../pages/admin/room/RoomManagement";

// Customer pages
import Home from "../pages/customer/Home";
import RoomList from "../pages/customer/RoomList";
import RoomDetail from "../pages/customer/RoomDetail";
import IncidentReport from "../pages/customer/IncidentReport";
import NewsDetail from "../components/news/NewsDetail";

export const router = createBrowserRouter([
    // AUTH
    {
        path: "auth",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "reset-password", element: <ResetPassword /> },
        ],
    },

    // EMPLOYEE
    {
        path: "employee",
        element: <EmployeeLayout />,
        children: [
            { path: "customer/list", element: <CustomerList /> },
            { path: "incidents", element: <IncidentManagement /> },
            { path: "bookingPage", element: <BookingPage /> },
            { path: "newsPage", element: <NewsPage /> },
            { path: "daily", element: <DailyWorkStatistics /> },
        ],
    },

    // ADMIN
    {
        path: "admin",
        element: <AdminLayout />,
        children: [
            { path: "", element: <Dashboard /> },
            { path: "checkin", element: <CheckInManager /> },
            { path: "checkout", element: <CheckOutManager /> },
            { path: "info", element: <NewsList /> }, // NewsList thay InfoManagement
            { path: "info/manage", element: <InfoManagement /> }, // nếu bạn cần InfoManagement
            { path: "info/:id", element: <NewsDetail /> },
            { path: "services", element: <ServiceManagement /> },
            { path: "room-management", element: <RoomManagement /> },
            { path: "bookingPage", element: <BookingPage /> },
        ],
    },

    // MAIN USER AREA
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

    // CUSTOMER
    {
        path: "customer",
        element: <CustomerLayout />,
        children: [
            { path: "room/list", element: <RoomList /> },
            { path: "room/:id", element: <RoomDetail /> },
            { path: "bookingPage", element: <BookingPage /> },
        ],
    },
]);
