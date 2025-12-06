import React from "react";
import {
  FaUtensils,
  FaTshirt,
  FaConciergeBell,
  FaShoppingCart,
} from "react-icons/fa";
import type { ServiceData } from "../../types/Report";

interface ServiceSummaryProps {
  data: ServiceData[];
}

const ServiceSummary: React.FC<ServiceSummaryProps> = ({ data }) => {
  const calculateSummary = () => {
    if (data.length === 0) return null;

    const totalFoodBeverage = data.reduce(
      (sum, item) => sum + item.foodBeverage,
      0
    );
    const totalLaundry = data.reduce((sum, item) => sum + item.laundry, 0);
    const totalOthers = data.reduce((sum, item) => sum + item.others, 0);
    const totalRevenue = totalFoodBeverage + totalLaundry + totalOthers;
    const totalOrders = data.reduce((sum, item) => sum + item.totalOrders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalFoodBeverage,
      totalLaundry,
      totalOthers,
      totalRevenue,
      totalOrders,
      avgOrderValue,
    };
  };

  const summary = calculateSummary();

  if (!summary) {
    return (
      <div className="text-center text-gray-500 py-8">No data available</div>
    );
  }

  const summaryCards = [
    {
      icon: <FaUtensils />,
      iconColor: "#FF6B6B",
      bgColor: "rgba(255, 107, 107, 0.1)",
      title: "Food & Beverage",
      value: `${summary.totalFoodBeverage.toLocaleString("vi-VN")} VND`,
      subtitle: `${(
        (summary.totalFoodBeverage / summary.totalRevenue) *
        100
      ).toFixed(1)}% of total`,
    },
    {
      icon: <FaTshirt />,
      iconColor: "#4ECDC4",
      bgColor: "rgba(78, 205, 196, 0.1)",
      title: "Laundry Service",
      value: `${summary.totalLaundry.toLocaleString("vi-VN")} VND`,
      subtitle: `${(
        (summary.totalLaundry / summary.totalRevenue) *
        100
      ).toFixed(1)}% of total`,
    },
    {
      icon: <FaConciergeBell />,
      iconColor: "#FFD93D",
      bgColor: "rgba(255, 217, 61, 0.1)",
      title: "Other Services",
      value: `${summary.totalOthers.toLocaleString("vi-VN")} VND`,
      subtitle: `${((summary.totalOthers / summary.totalRevenue) * 100).toFixed(
        1
      )}% of total`,
    },
    {
      icon: <FaShoppingCart />,
      iconColor: "#6BCF7F",
      bgColor: "rgba(107, 207, 127, 0.1)",
      title: "Average Order Value",
      value: `${summary.avgOrderValue.toLocaleString("vi-VN")} VND`,
      subtitle: `From ${summary.totalOrders} orders`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryCards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-lg shadow-sm border border-[#EBE3D7]"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: card.bgColor }}
          >
            <span style={{ color: card.iconColor }} className="text-xl">
              {card.icon}
            </span>
          </div>
          <h3 className="text-sm text-gray-600 mb-1">{card.title}</h3>
          <p className="text-2xl font-bold mb-1">{card.value}</p>
          <p className="text-xs text-gray-500">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceSummary;
