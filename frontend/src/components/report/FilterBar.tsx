import React from "react";
import type { ReportPeriod } from "../../types/Report";

interface FilterBarProps {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ period, onPeriodChange }) => {
  const periods: { value: ReportPeriod; label: string }[] = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  return (
    <div className="flex gap-2">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onPeriodChange(p.value)}
          className={`px-4 py-2 rounded-md font-medium transition ${
            period === p.value
              ? "bg-[#CCBDA3] text-white"
              : "bg-white text-gray-700 border border-[#EBE3D7] hover:bg-[#F5F0EB]"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
