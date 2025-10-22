import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

// Auth pages
import Login from "../pages/auth/Login";

export const router = createBrowserRouter([
  {
    path: "",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      //   { path: "register", element: <Register /> },
      //   { path: "forgot-password", element: <ForgotPassword /> },
      //   { path: "reset-password", element: <ResetPassword /> },
    ],
  },
]);
