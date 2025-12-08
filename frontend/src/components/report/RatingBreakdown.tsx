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

const RatingBreakdown: React.FC = () => {
  const categoryData = [
    { category: "Room Quality", rating: 4.5, maxRating: 5 },
    { category: "Service", rating: 4.7, maxRating: 5 },
    { category: "Location", rating: 4.3, maxRating: 5 },
    { category: "Value", rating: 4.2, maxRating: 5 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-[#EBE3D7] rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.category}</p>
          <p className="text-sm">Rating: {payload[0].value.toFixed(1)}/5.0</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
      <h3 className="text-lg font-semibold mb-4">
        Rating Breakdown by Category
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={categoryData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#EBE3D7" />
          <XAxis type="number" domain={[0, 5]} stroke="#666" />
          <YAxis dataKey="category" type="category" width={100} stroke="#666" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="rating" fill="#CCBDA3" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {categoryData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.category}</span>
              <span className="font-semibold">
                {item.rating.toFixed(1)}/5.0
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#CCBDA3] h-2 rounded-full"
                style={{ width: `${(item.rating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingBreakdown;
