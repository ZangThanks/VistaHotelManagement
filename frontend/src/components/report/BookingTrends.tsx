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
import type { BookingData } from "../../../types/Report";
import { FaChartLine, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

interface BookingTrendsProps {
  data: BookingData[];
}

const BookingTrends: React.FC<BookingTrendsProps> = ({ data }) => {
  const totalBookings = data.reduce((sum, item) => sum + item.totalBookings, 0);
  const avgCancellationRate =
    data.reduce((sum, item) => sum + item.cancellationRate, 0) / data.length;
  const confirmedBookings = Math.round(
    totalBookings * (1 - avgCancellationRate / 100)
  );
  const cancelledBookings = totalBookings - confirmedBookings;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-[#EBE3D7] rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.date}</p>
          <p className="text-sm">Total Bookings: {payload[0].value}</p>
          <p className="text-sm text-red-600">
            Cancellation Rate: {payload[1].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-[#EBE3D7]">
          <div className="flex items-center justify-between mb-3">
            <FaChartLine className="text-2xl text-[#CCBDA3]" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
          <p className="text-3xl font-bold">{totalBookings}</p>
          <p className="text-xs text-gray-500 mt-1">in selected period</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-[#EBE3D7]">
          <div className="flex items-center justify-between mb-3">
            <FaCheckCircle className="text-2xl text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">
            {confirmedBookings}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {((confirmedBookings / totalBookings) * 100).toFixed(1)}% of total
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-[#EBE3D7]">
          <div className="flex items-center justify-between mb-3">
            <FaTimesCircle className="text-2xl text-red-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Cancelled</p>
          <p className="text-3xl font-bold text-red-600">{cancelledBookings}</p>
          <p className="text-xs text-gray-500 mt-1">
            Avg rate: {avgCancellationRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
        <h3 className="text-lg font-semibold mb-4">
          Booking Trends & Cancellation Rate
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EBE3D7" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis yAxisId="left" stroke="#666" />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#666"
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalBookings"
              stroke="#CCBDA3"
              strokeWidth={2}
              name="Total Bookings"
              dot={{ fill: "#CCBDA3", r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cancellationRate"
              stroke="#F44336"
              strokeWidth={2}
              name="Cancellation Rate (%)"
              dot={{ fill: "#F44336", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingTrends;
