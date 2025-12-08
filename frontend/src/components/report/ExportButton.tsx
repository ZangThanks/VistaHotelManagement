import React, { useState } from "react";
import { FaDownload, FaFilePdf, FaFileExcel } from "react-icons/fa";
import type { DateRange } from "../../types/Report";

interface ExportButtonProps {
  reportType: string;
  dateRange: DateRange;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  reportType,
  dateRange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: "pdf" | "excel") => {
    // setLoading(true);
    // try {
    //   //   const blob = await exportReport(reportType, dateRange, format);
    //   //   const url = window.URL.createObjectURL(blob);
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.download = `${reportType}_report_${dateRange.startDate}_${
    //     dateRange.endDate
    //   }.${format === "pdf" ? "pdf" : "xlsx"}`;
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    //   window.URL.revokeObjectURL(url);
    //   setIsOpen(false);
    // } catch (error) {
    //   console.error("Export failed:", error);
    //   alert("Failed to export report");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-[#c7a160] text-white rounded-md hover:bg-[#b8ac94] transition disabled:opacity-50"
      >
        <FaDownload />
        {loading ? "Exporting..." : "Export Report"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#EBE3D7] z-10">
          <button
            onClick={() => handleExport("pdf")}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F0EB] transition"
          >
            <FaFilePdf className="text-red-500" />
            <span>Export as PDF</span>
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F0EB] transition border-t border-[#EBE3D7]"
          >
            <FaFileExcel className="text-green-600" />
            <span>Export as Excel</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
