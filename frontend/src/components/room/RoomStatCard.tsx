import React from "react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";

interface RoomStatCardProps {
  icon: IconType;
  iconBgColor: string;
  iconColor: string;
  value: string | number;
  label: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

/**
 * Component hiển thị thẻ thống kê phòng
 * @param icon - Icon hiển thị
 * @param iconBgColor - Màu nền icon
 * @param iconColor - Màu icon
 * @param value - Giá trị hiển thị
 * @param label - Nhãn mô tả
 * @param trend - Xu hướng tăng/giảm (tùy chọn)
 */
const RoomStatCard: React.FC<RoomStatCardProps> = ({
  icon: Icon,
  iconBgColor,
  iconColor,
  value,
  label,
  trend,
}) => {
  return (
    <motion.div
      className="bg-white p-2 sm:p-3 px-3 sm:px-4 rounded-xl shadow-sm border border-[#ebe3d7] flex items-center gap-3 sm:gap-4"
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`text-xl sm:text-2xl ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
          {value}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 truncate">{label}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RoomStatCard;
