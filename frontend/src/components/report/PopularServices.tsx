/* eslint-disable */
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PopularServices: React.FC = () => {
  const servicesData = [
    { service: "Breakfast", orders: 1250, revenue: 625000000 },
    { service: "Room Service", orders: 850, revenue: 680000000 },
    { service: "Laundry", orders: 420, revenue: 450000000 },
    { service: "Dry Cleaning", orders: 280, revenue: 380000000 },
    { service: "Minibar", orders: 650, revenue: 325000000 },
    { service: "Spa Services", orders: 180, revenue: 270000000 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-[#EBE3D7] rounded-lg shadow-lg">
          <p className="font-semibold mb-1">{payload[0].payload.service}</p>
          <p className="text-sm">Orders: {payload[0].value}</p>
          <p className="text-sm text-gray-600">
            Revenue: {payload[0].payload.revenue.toLocaleString("vi-VN")} VND
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
      <h3 className="text-lg font-semibold mb-4">Most Popular Services</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={servicesData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#EBE3D7" />
          <XAxis type="number" stroke="#666" />
          <YAxis dataKey="service" type="category" width={120} stroke="#666" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="orders" fill="#CCBDA3" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularServices;
