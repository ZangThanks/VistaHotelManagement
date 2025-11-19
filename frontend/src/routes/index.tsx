import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// Auth pages
import Login from "../pages/auth/Login";
import CustomerList from "../pages/employee/CustomerList";
import NewsPage from "../pages/employee/NewsPage";
import AdminLayout from "../layouts/AdminLayout";
import BookingPage from "../pages/admin/booking/BookingPage";
import Register from "../pages/auth/Register";
import MainLayout from "../layouts/MainLayout";
import CheckInManager from "../pages/employee/CheckInManager";
import CheckOutManager from "../pages/employee/CheckOutManager";
import Home from "../pages/customer/Home";
import RoomList from "../pages/customer/RoomList";
// import NewsDetail from "../components/news/NewsDetail";
import InfoManagement from "../pages/admin/infomation/InfoManagement";
import ForgotPassword from "../pages/auth/ForgotPassword.tsx";
import ResetPassword from "../pages/auth/ResetPassword.tsx";
import Dashboard from "../pages/admin/dashboard/Dashboard.tsx";
import NewsDetail from "../components/news/NewsDetail.tsx";
import RoomManagement from "../pages/admin/room/RoomManagement.tsx";
import RoomDetail from "../pages/customer/RoomDetail.tsx";
import CustomerLayout from "../layouts/CustomerLayout.tsx";

export const router = createBrowserRouter([
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
  {
    path: "employee",
    element: <EmployeeLayout />,
    children: [
      { path: "customer/list", element: <CustomerList /> },
      { path: "bookingPage", element: <BookingPage /> },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "checkin", element: <CheckInManager /> },
      { path: "checkout", element: <CheckOutManager /> },
      { path: "info", element: <InfoManagement /> },
      { path: "info/:id", element: <NewsDetail /> },
      { path: "room-management", element: <RoomManagement /> },
    ],
  },
  {
    path: "",
    element: <EmployeeLayout />,
    children: [
      { path: "newsPage", element: <NewsPage /> },
      { path: "bookingPage", element: <BookingPage /> },
    ],
  },
  {
    path: "",
    element: <MainLayout />,
    children: [
      { path: "/newsPage", element: <NewsPage /> },
      { path: "/home", element: <Home /> },
    ],
  },
    {
        path: "customer",
        element: <CustomerLayout />,
        children: [
            { path: "room/list", element: <RoomList /> },
            { path: "room/:id", element: <RoomDetail /> },
        ],
    },
]);
