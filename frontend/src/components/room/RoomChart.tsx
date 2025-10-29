import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface RoomChartProps {
  data: Array<{
    month: string;
    occupied: number;
    available: number;
    maintenance: number;
  }>;
  type?: "bar" | "line";
}

/**
 * Component hiển thị biểu đồ công suất sử dụng phòng
 * @param data - Dữ liệu biểu đồ theo tháng
 * @param type - Loại biểu đồ (bar hoặc line)
 */
const RoomChart: React.FC<RoomChartProps> = ({ data, type = "bar" }) => {
  const colors = {
    occupied: "#10b981",
    available: "#3b82f6",
    maintenance: "#f59e0b",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ebe3d7]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Room Usage Capacity</h2>
        <p className="text-sm text-gray-600 mt-1">
          Monthly room status statistics
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        {type === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="occupied"
              name="Occupied"
              fill={colors.occupied}
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="available"
              name="Available"
              fill={colors.available}
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="maintenance"
              name="Maintenance"
              fill={colors.maintenance}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="occupied"
              name="Occupied"
              stroke={colors.occupied}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="available"
              name="Available"
              stroke={colors.available}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="maintenance"
              name="Maintenance"
              stroke={colors.maintenance}
              strokeWidth={2}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default RoomChart;
