import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ReviewData } from "../../../types/Report";

interface ReviewChartProps {
  data: ReviewData[];
}

const ReviewChart: React.FC<ReviewChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-[#EBE3D7] rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.date}</p>
          <p className="text-sm">
            Average Rating: <strong>{payload[0].value.toFixed(1)}/5.0</strong>
          </p>
          <p className="text-sm text-gray-600">
            Total Reviews: {payload[0].payload.totalReviews}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EBE3D7" />
        <XAxis dataKey="date" stroke="#666" />
        <YAxis domain={[0, 5]} stroke="#666" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="averageRating"
          stroke="#CCBDA3"
          strokeWidth={3}
          name="Average Rating"
          dot={{ fill: "#CCBDA3", r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ReviewChart;
