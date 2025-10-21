import {
  BarChart2,
  DollarSign,
  Menu,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: BarChart2,
    color: "#1114171",
    href: "/overview",
  },
  {
    name: "Room Management",
    icon: ShoppingBag,
    color: "#1114171",
    href: "/courses",
  },
  {
    name: "Booking Management",
    icon: Users,
    color: "#1114171",
    href: "/users",
  },
  { name: "Guest", icon: DollarSign, color: "#1114171", href: "/sales" },
  {
    name: "Services",
    icon: ShoppingCart,
    color: "#1114171",
    href: "/certificates",
  },
  { name: "Report", icon: TrendingUp, color: "#1114171", href: "/analytics" },
  { name: "Setting", icon: TrendingUp, color: "#1114171", href: "/settings" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 bg-[#F5F0EB] ${
        isSidebarOpen ? "w-[220px]" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 220 : 80 }}
    >
      <div className="h-full bg-opacity-50 backdrop-blur-md p-4 flex flex-col bg-[#F5F0EB]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-[#f4e5d6] transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[#f4e5d6] transition-colors mb-2">
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-1 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};
export default Sidebar;
