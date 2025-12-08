import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";

const SentimentAnalysis: React.FC = () => {
  const sentimentData = [
    { name: "Positive", value: 680, color: "#00C853", icon: <FaSmile /> },
    { name: "Neutral", value: 215, color: "#FF9800", icon: <FaMeh /> },
    { name: "Negative", value: 58, color: "#F44336", icon: <FaFrown /> },
  ];

  const total = sentimentData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-[#EBE3D7] rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">{payload[0].value} reviews</p>
          <p className="text-sm text-gray-600">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
      <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={sentimentData}
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
            {sentimentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {sentimentData.map((item, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-lg"
            style={{ backgroundColor: `${item.color}20` }}
          >
            <div
              className="text-3xl mb-2 flex justify-center"
              style={{ color: item.color }}
            >
              {item.icon}
            </div>
            <p className="font-semibold text-lg">{item.value}</p>
            <p className="text-sm text-gray-600">{item.name}</p>
            <p className="text-xs text-gray-500">
              {((item.value / total) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentAnalysis;
