import React from "react";
import { Outlet } from "react-router-dom";
import bgImage from "../assets/images/resort-bg.png";

const AuthLayout: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      {/* Main content - no scroll here */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-lg p-8 m-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
