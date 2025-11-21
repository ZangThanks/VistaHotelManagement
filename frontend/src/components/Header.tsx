import React, { useState } from "react";
import { getById } from "../services/customerService";
import type { Customer } from "../types/Customer";

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const [customer, setCustomer] = useState<Customer>();
  const [, setError] = useState("");
  const [, setLoading] = useState(true);

  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0].toUpperCase())
      .join("");
  };

  const _cust = customer as unknown as Record<string, unknown> | undefined;
  const avatarUrl =
    (_cust?.avatarUrl as string) || (_cust?.avatar as string) || "";

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userDataStr = localStorage.getItem("user");
      const userData = userDataStr ? JSON.parse(userDataStr) : null;
      const customerId = userData?.data?.id || userData?.id;

      if (customerId) {
        const cust = await getById(customerId);
        setCustomer(cust);
      }
      setLoading(false);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center px-4 py-2 bg-[#F5F0EB] shadow">
      {/* Nút Menu bên trái */}
      <button
        onClick={onMenuClick}
        aria-label="Menu"
        className="text-2xl text-gray-800 hover:text-amber-700 transition duration-200"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <button className="text-xl ml-2 text-gray-700 hover:opacity-75 transition">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
      {/* Logo ở giữa */}
      <img
        src="/src/assets/images/logo.png"
        alt="Company Logo"
        className=" w-13 absolute left-1/2 -translate-x-1/2"
      />

      {/* Avatar bên 
      phải */}
      <button
        aria-label="User profile"
        className="ml-auto flex items-center gap-2 hover:opacity-80 transition"
      >
        <span className="hidden sm:inline text-sm font-medium text-gray-800">
          {customer?.fullName}
        </span>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="User avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
            {getInitials(customer?.fullName || customer?.userName) || "U"}
          </div>
        )}
      </button>
    </div>
  );
};

export default Header;
