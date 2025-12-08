import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { BookingData } from "../../../types/Report";

interface BookingChartProps {
  data: BookingData[];
}

const BookingChart: React.FC<BookingChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-[#EBE3D7] rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.date}</p>
          <p className="text-sm">Website: {payload[0].value} bookings</p>
          <p className="text-sm">Phone: {payload[1].value} bookings</p>
          <p className="text-sm">Walk-in: {payload[2].value} bookings</p>
          <p className="text-sm font-semibold mt-1">
            Total: {payload[0].payload.totalBookings} bookings
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorWebsite" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#CCBDA3" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#CCBDA3" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorPhone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#2196F3" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorWalkin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00C853" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#00C853" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#EBE3D7" />
        <XAxis dataKey="date" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="website"
          stackId="1"
          stroke="#CCBDA3"
          fill="url(#colorWebsite)"
          name="Website"
        />
        <Area
          type="monotone"
          dataKey="phone"
          stackId="1"
          stroke="#2196F3"
          fill="url(#colorPhone)"
          name="Phone"
        />
        <Area
          type="monotone"
          dataKey="walkin"
          stackId="1"
          stroke="#00C853"
          fill="url(#colorWalkin)"
          name="Walk-in"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BookingChart;
