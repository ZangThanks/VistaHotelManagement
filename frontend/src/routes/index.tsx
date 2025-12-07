import { createBrowserRouter } from "react-router-dom";

/* ===================== LAYOUTS ===================== */
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import CustomerLayout from "../layouts/CustomerLayout";

/* ===================== AUTH ===================== */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import OAuthSuccess from "../pages/auth/OAuthSuccess";

/* ===================== EMPLOYEE ===================== */
import CustomerList from "../pages/employee/CustomerList";
import NewsPage from "../pages/employee/NewsPage";
import CheckInManager from "../pages/employee/CheckInManager";
import CheckOutManager from "../pages/employee/CheckOutManager";
import IncidentManagement from "../pages/employee/IncidentManagement";
import DailyWorkStatistics from "../pages/employee/DailyWorkStatistics";
import ServiceOrderManagement from "../pages/employee/ServiceOrderManagement";
import ChatSupport from "../pages/employee/ChatSupport";
import RoomManagement from "../pages/employee/room/RoomManagement";
import RoomTypeManagement from "../pages/employee/room/RoomTypeManagement";

/* ===================== ADMIN ===================== */
import Dashboard from "../pages/admin/dashboard/Dashboard";
import NewsDetail from "../pages/admin/news/NewsDetail";
import NewsList from "../pages/admin/news/NewsList";
import EmployeeList from "../pages/admin/EmployeeList";
import PricingManager from "../pages/admin/pricing/PricingManager";
import PromotionManagement from "../pages/admin/promotion/PromotionManagement";
import PromotionTypeManagement from "../pages/admin/promotion/PromotionTypeManagement";
import VoucherManagement from "../pages/admin/voucher/VoucherManagement";
import ServiceManagement from "../pages/admin/ServiceManagement";
import ReportPage from "../pages/admin/report/Report";
import RoomCart from "../pages/admin/booking/RoomCart";

/* ===================== CUSTOMER ===================== */
import Home from "../pages/customer/Home";
import RoomList from "../pages/customer/RoomList";
import RoomDetail from "../pages/customer/RoomDetail";
import RoomChange from "../pages/customer/RoomChange";
import ServiceList from "../pages/customer/ServiceList";
import IncidentReport from "../pages/customer/IncidentReport";
import Contact from "../pages/customer/Contact";
import BookingPage from "../pages/customer/booking/BookingPage";
import PaymentPage from "../pages/customer/booking/PaymentPage";
import FAQ from "../pages/customer/FAQ";
import AIConcierge from "../pages/customer/AIConcierge";
import UserProfilePage from "../pages/customer/UserProfile";
import MyBookings from "../pages/customer/MyBooking";
import BookingDetail from "../pages/customer/BookingDetail";      // HEAD
import BookingDetailPage from "../pages/customer/BookingDetail"; // PPH alias

/* =====================================================
                     ROUTER FINAL
===================================================== */

export const router = createBrowserRouter([
    /* ---------- OAuth Callback ---------- */
    {
        path: "/oauth-success",
        element: <OAuthSuccess />,
    },

    /* ---------- AUTH ---------- */
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

    /* ---------- EMPLOYEE ---------- */
    {
        path: "employee",
        element: <EmployeeLayout />,
        children: [
            { path: "customer/list", element: <CustomerList /> },
            { path: "incidents", element: <IncidentManagement /> },
            { path: "bookingPage", element: <BookingPage /> },
            { path: "newsPage", element: <NewsPage /> },
            { path: "daily", element: <DailyWorkStatistics /> },
            { path: "service-orders", element: <ServiceOrderManagement /> },
            { path: "support", element: <ChatSupport /> },
            { path: "room-management", element: <RoomManagement /> },
            { path: "room-type-management", element: <RoomTypeManagement /> },
            { path: "profile", element: <UserProfilePage /> },
        ],
    },

    /* ---------- ADMIN ---------- */
    {
        path: "admin",
        element: <AdminLayout />,
        children: [
            { path: "", element: <Dashboard /> },
            { path: "checkin", element: <CheckInManager /> },
            { path: "checkout", element: <CheckOutManager /> },
            { path: "info", element: <NewsList /> },
            { path: "info/:id", element: <NewsDetail /> },
            { path: "services", element: <ServiceManagement /> },
            { path: "room-management", element: <RoomManagement /> },
            { path: "room-type-management", element: <RoomTypeManagement /> },
            { path: "promotion-management", element: <PromotionManagement /> },
            { path: "promotion-type-management", element: <PromotionTypeManagement /> },
            { path: "voucher-management", element: <VoucherManagement /> },
            { path: "bookingPage", element: <BookingPage /> },
            { path: "employees", element: <EmployeeList /> },
            { path: "pricing", element: <PricingManager /> },
            { path: "profile", element: <UserProfilePage /> },
            { path: "reports", element: <ReportPage /> },
        ],
    },

    /* ---------- MAIN PUBLIC AREA ---------- */
    {
        path: "",
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "home", element: <Home /> },
            { path: "news", element: <NewsList /> },
            { path: "news/:id", element: <NewsDetail /> },
            { path: "incident-report", element: <IncidentReport /> },
            { path: "contact", element: <Contact /> },
            { path: "bookingPage", element: <BookingPage /> },
            { path: "room", element: <RoomList /> },
            { path: "room/:id", element: <RoomDetail /> },
            { path: "service", element: <ServiceList /> },
            { path: "faq", element: <FAQ /> },
            { path: "chat", element: <AIConcierge /> },
        ],
    },

    /* ---------- CUSTOMER ---------- */
    {
        path: "customer",
        element: <CustomerLayout />,
        children: [
            { path: "room", element: <RoomList /> },
            { path: "room/:id", element: <RoomDetail /> },
            { path: "room/incident", element: <IncidentReport /> },
            { path: "room-change", element: <RoomChange /> },

            /* Booking routes (HEAD + PPH unified) */
            { path: "bookingPage", element: <BookingPage /> },
            { path: "booking/:id", element: <BookingDetail /> },
            { path: "mybooking", element: <MyBookings /> },
            { path: "mybooking/:id", element: <BookingDetailPage /> },

            { path: "service", element: <ServiceList /> },
            { path: "payment", element: <PaymentPage /> },
            { path: "profile", element: <UserProfilePage /> },
            { path: "cart", element: <RoomCart /> },
        ],
    },
]);
