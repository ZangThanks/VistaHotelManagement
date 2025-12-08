import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import CustomerLayout from "../layouts/CustomerLayout.tsx";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import OAuthSuccess from "../pages/auth/OAuthSuccess";

// Employee pages
import CustomerList from "../pages/employee/CustomerList";
import NewsPage from "../pages/employee/NewsPage";
import CheckInManager from "../pages/employee/CheckInManager";
import CheckOutManager from "../pages/employee/CheckOutManager";
import IncidentManagement from "../pages/employee/IncidentManagement";
import DailyWorkStatistics from "../pages/employee/DailyWorkStatistics.tsx";
import RoomManagement from "../pages/employee/room/RoomManagement.tsx";
import RoomTypeManagement from "../pages/employee/room/RoomTypeManagement.tsx";
import ChatSupport from "../pages/employee/ChatSupport.tsx";

// Admin pages
import Dashboard from "../pages/admin/dashboard/Dashboard.tsx";
import NewsDetail from "../pages/admin/news/NewsDetail.tsx";
import NewsList from "../pages/admin/news/NewsList.tsx";
import ServiceManagement from "../pages/admin/ServiceManagement.tsx";
import EmployeeList from "../pages/admin/EmployeeList.tsx";
import VoucherManagement from "../pages/admin/voucher/VoucherManagement.tsx";
import PromotionManagement from "../pages/admin/promotion/PromotionManagement.tsx";
import PromotionTypeManagement from "../pages/admin/promotion/PromotionTypeManagement.tsx";
import PricingManager from "../pages/admin/pricing/PricingManager.tsx";
import RoomCart from "../pages/admin/booking/RoomCart.tsx";
import ReportPage from "../pages/admin/report/Report.tsx";

// Customer pages
import Home from "../pages/customer/Home";
import RoomList from "../pages/customer/RoomList";
import RoomDetail from "../pages/customer/RoomDetail.tsx";
import ServiceList from "../pages/customer/ServiceList.tsx";
import IncidentReport from "../pages/customer/IncidentReport.tsx";
import BookingDetail from "../pages/customer/BookingDetail.tsx";
import Contact from "../pages/customer/Contact.tsx";
import BookingPage from "../pages/customer/booking/BookingPage.tsx";
import MyBookings from "../pages/customer/MyBooking.tsx";
import UserProfilePage from "../pages/customer/UserProfile.tsx";

import PaymentPage from "../pages/customer/booking/PaymentPage.tsx";

// Error pages
import AccessDenied403 from "../pages/error/AccessDenied403.tsx";
import NotFound404 from "../pages/error/NotFound404.tsx";
import ServerError500 from "../pages/error/ServerError500.tsx";

export const router = createBrowserRouter([
  // OAuth
  {
    path: "/oauth-success",
    element: <OAuthSuccess />,
  },
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
      { path: "daily", element: <DailyWorkStatistics /> },
      { path: "room-management", element: <RoomManagement /> },
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
      { path: "info/:id", element: <NewsDetail /> },
      { path: "services", element: <ServiceManagement /> },
      { path: "room-management", element: <RoomManagement /> },
      { path: "room-type-management", element: <RoomTypeManagement /> },
      { path: "bookingPage", element: <BookingPage /> },
      { path: "employees", element: <EmployeeList /> },
      // { path: 'employees/:id', element: <EmployeeDetail /> },
      { path: "pricing", element: <PricingManager /> },
      { path: "voucher-management", element: <VoucherManagement /> },
      { path: "support", element: <ChatSupport /> },
      { path: "promotion-management", element: <PromotionManagement /> },
      {
        path: "promotion-type-management",
        element: <PromotionTypeManagement />,
      },

      { path: "profile", element: <UserProfilePage /> },
      { path: "reports", element: <ReportPage /> },
    ],
  },

  // MAIN USER AREA
  {
    path: "",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "news", element: <NewsPage /> },
      { path: "news/:id", element: <NewsDetail /> },
      { path: "incident-report", element: <IncidentReport /> },
      { path: "/contact", element: <Contact /> },
      { path: "/bookingPage", element: <BookingPage /> },
      { path: "room", element: <RoomList /> },
      { path: "room/:id", element: <RoomDetail /> },
      { path: "service", element: <ServiceList /> },
    ],
  },

  // CUSTOMER
  {
    path: "customer",
    element: <CustomerLayout />,
    children: [
      { path: "room", element: <RoomList /> },
      { path: "room/incident", element: <IncidentReport /> },
      { path: "room/:id", element: <RoomDetail /> },
      { path: "service", element: <ServiceList /> },
      { path: "bookingPage", element: <BookingPage /> },
      { path: "mybooking", element: <MyBookings /> },
      { path: "mybooking/:id", element: <BookingDetail /> },
      { path: "mybooking", element: <MyBookings /> },
      { path: "payment", element: <PaymentPage /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "cart", element: <RoomCart /> },
    ],
  },

  // ERROR PAGES
  {
    path: "/403",
    element: <AccessDenied403 />,
  },
  {
    path: "/500",
    element: <ServerError500 />,
  },
  {
    path: "*",
    element: <NotFound404 />,
  },
]);
