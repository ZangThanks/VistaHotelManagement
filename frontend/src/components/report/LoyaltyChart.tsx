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
import type { LoyaltyData } from "../../../types/Report";

interface LoyaltyChartProps {
  data: LoyaltyData[];
}

const LoyaltyChart: React.FC<LoyaltyChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-[#EBE3D7] rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{payload[0].payload.month}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value} members
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EBE3D7" />
        <XAxis dataKey="month" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="bronze" stackId="a" fill="#CD7F32" name="Bronze" />
        <Bar dataKey="silver" stackId="a" fill="#C0C0C0" name="Silver" />
        <Bar dataKey="gold" stackId="a" fill="#FFD700" name="Gold" />
        <Bar dataKey="platinum" stackId="a" fill="#E5E4E2" name="Platinum" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LoyaltyChart;
