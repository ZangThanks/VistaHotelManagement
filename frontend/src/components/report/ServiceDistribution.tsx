import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const ServiceDistribution: React.FC = () => {
  const distributionData = [
    { name: "Food & Beverage", value: 1850000000, color: "#FF6B6B" },
    { name: "Laundry", value: 450000000, color: "#4ECDC4" },
    { name: "Other Services", value: 320000000, color: "#FFD93D" },
  ];

  const total = distributionData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-[#EBE3D7] rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">
            {payload[0].value.toLocaleString("vi-VN")} VND
          </p>
          <p className="text-sm text-gray-600">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
      <h3 className="text-lg font-semibold mb-4">
        Service Revenue Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={distributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {distributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {distributionData.map((item, index) => (
          <div key={index} className="text-center">
            <div
              className="w-4 h-4 rounded mx-auto mb-2"
              style={{ backgroundColor: item.color }}
            ></div>
            <p className="text-sm font-semibold">
              {item.value.toLocaleString("vi-VN")} VND
            </p>
            <p className="text-xs text-gray-600">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDistribution;
