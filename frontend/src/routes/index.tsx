import { createBrowserRouter } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/customer/Home";
import ServiceList from "../pages/customer/ServiceList";

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
      { path: "", element: <Home /> },
      { path: "service-list", element: <ServiceList /> },
      // { path: "register", element: <Register /> },
      //   { path: "forgot-password", element: <ForgotPassword /> },
      //   { path: "reset-password", element: <ResetPassword /> },
    ],
  },
]);
