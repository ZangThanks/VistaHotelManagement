import { motion } from "framer-motion";

interface VoucherFilterProps {
  filter: "all" | "active" | "expiring";
  onFilterChange: (filter: "all" | "active" | "expiring") => void;
}

const VoucherFilter: React.FC<VoucherFilterProps> = ({
  filter,
  onFilterChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex justify-center gap-2 mb-8"
    >
      <button
        onClick={() => onFilterChange("all")}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          filter === "all"
            ? "bg-gradient-to-r from-[#c3923c] to-[#b4893e] text-white shadow-lg shadow-[#c3923c]/50 scale-105"
            : "bg-white text-gray-700 hover:shadow-md border-2 border-[#ebe3d7]"
        }`}
      >
        All Vouchers
      </button>
      <button
        onClick={() => onFilterChange("active")}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          filter === "active"
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50 scale-105"
            : "bg-white text-gray-700 hover:shadow-md border-2 border-[#ebe3d7]"
        }`}
      >
        Active Only
      </button>
      <button
        onClick={() => onFilterChange("expiring")}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          filter === "expiring"
            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50 scale-105"
            : "bg-white text-gray-700 hover:shadow-md border-2 border-[#ebe3d7]"
        }`}
      >
        Expiring Soon
      </button>
    </motion.div>
  );
};

export default VoucherFilter;
