import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
// import CustomerLayout from "../layouts/CustomerLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import OAuthSuccess from "../pages/auth/OAuthSuccess.tsx";

import CustomerList from "../pages/employee/CustomerList";
import NewsPage from "../pages/employee/NewsPage";
import AdminLayout from "../layouts/AdminLayout";

import MainLayout from "../layouts/MainLayout";
import CheckInManager from "../pages/employee/CheckInManager";
import CheckOutManager from "../pages/employee/CheckOutManager";
import IncidentManagement from "../pages/employee/IncidentManagement";

import Home from "../pages/customer/Home";
import RoomList from "../pages/customer/RoomList";
import Dashboard from "../pages/admin/dashboard/Dashboard.tsx";
import NewsDetail from "../pages/admin/news/NewsDetail.tsx";
import RoomDetail from "../pages/customer/RoomDetail.tsx";
import CustomerLayout from "../layouts/CustomerLayout.tsx";
import DailyWorkStatistics from "../pages/employee/DailyWorkStatistics.tsx";
import NewsList from "../pages/admin/news/NewsList.tsx";
import ServiceList from "../pages/customer/ServiceList.tsx";
import IncidentReport from "../pages/customer/IncidentReport.tsx";
import ServiceManagement from "../pages/admin/ServiceManagement.tsx";
import Contact from "../pages/customer/Contact.tsx";
import EmployeeList from "../pages/admin/EmployeeList.tsx";
import BookingPage from "../pages/customer/booking/BookingPage.tsx";
import FAQ from "../pages/customer/FAQ.tsx";
import AIConcierge from "../pages/customer/AIConcierge.tsx";
import ChatSupport from "../pages/employee/ChatSupport.tsx";
import PricingManager from "../pages/admin/pricing/PricingManager.tsx";
import MyBookings from "../pages/customer/MyBooking.tsx";
import RoomManagement from "../pages/employee/room/RoomManagement.tsx";
import RoomCart from "../pages/admin/booking/RoomCart.tsx";
import PaymentPage from "../pages/customer/booking/PaymentPage.tsx";
import UserProfilePage from "../pages/customer/UserProfile.tsx";
import RoomTypeManagement from "../pages/employee/room/RoomTypeManagement.tsx";
import PromotionManagement from "../pages/admin/promotion/PromotionManagement.tsx";
import PromotionTypeManagement from "../pages/admin/promotion/PromotionTypeManagement.tsx";
import VoucherManagement from "../pages/admin/voucher/VoucherManagement.tsx";
import ReportPage from "../pages/admin/report/Report.tsx";
import BookingDetailPage from "../pages/customer/BookingDetail.tsx";
import ReviewsPage from "../pages/customer/review/ReviewPage.tsx";
import ReplyReviewsPage from "../pages/employee/review/ReplyReviewPage.tsx";

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
      { path: "newsPage", element: <NewsPage /> },
      { path: "daily", element: <DailyWorkStatistics /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "room-management", element: <RoomManagement /> },
      { path: "room-type-management", element: <RoomTypeManagement /> },
      { path: "support", element: <ChatSupport /> },
      { path: "reviews", element: <ReplyReviewsPage /> },
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
      //{ path: 'info/manage', element: <NewsList /> }, // nếu bạn cần InfoManagement
      { path: "info/:id", element: <NewsDetail /> },
      { path: "services", element: <ServiceManagement /> },
      { path: "room-management", element: <RoomManagement /> },
      { path: "room-type-management", element: <RoomTypeManagement /> },
      { path: "promotion-management", element: <PromotionManagement /> },
      {
        path: "promotion-type-management",
        element: <PromotionTypeManagement />,
      },
      { path: "voucher-management", element: <VoucherManagement /> },
      { path: "bookingPage", element: <BookingPage /> },
      { path: "employees", element: <EmployeeList /> },
      { path: "pricing", element: <PricingManager /> },
      // { path: 'employees/:id', element: <EmployeeDetail /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "reports", element: <ReportPage /> },
      { path: "", element: <Dashboard /> },
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
      { path: "faq", element: <FAQ /> },
      { path: "chat", element: <AIConcierge /> },
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
      { path: "mybooking/:id", element: <BookingDetailPage /> },
      { path: "payment", element: <PaymentPage /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "cart", element: <RoomCart /> },
      { path: "reviews/:id", element: <ReviewsPage /> },
    ],
  },
]);
