import React, { useState } from 'react';
import { FaDownload, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import type { DateRange } from '../../types/Report';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ExportButtonProps {
    reportType: string;
    dateRange: DateRange;
    data?: any; // Data từ trang hiện tại
}

const ExportButton: React.FC<ExportButtonProps> = ({
    reportType,
    dateRange,
    data,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const exportToPDF = (reportData: any) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.text(`${reportType.toUpperCase()} REPORT`, 14, 22);
        doc.setFontSize(11);
        doc.text(
            `Period: ${dateRange.startDate} to ${dateRange.endDate}`,
            14,
            30,
        );

        // Phân nhánh theo loại báo cáo
        switch (reportType) {
            case 'services':
                if (data && Array.isArray(data)) {
                    const tableData = data.map((item: any) => [
                        item.date || '',
                        item.foodBeverage?.toLocaleString() || '0',
                        item.laundry?.toLocaleString() || '0',
                        item.spa?.toLocaleString() || '0',
                        item.transport?.toLocaleString() || '0',
                        item.tour?.toLocaleString() || '0',
                        item.others?.toLocaleString() || '0',
                        item.totalOrders || '0',
                    ]);

                    autoTable(doc, {
                        startY: 35,
                        head: [
                            [
                                'Date',
                                'Food & Beverage',
                                'Laundry',
                                'Spa',
                                'Transport',
                                'Tour',
                                'Others',
                                'Total Orders',
                            ],
                        ],
                        body: tableData,
                    });
                }
                break;

            case 'revenue':
            case 'occupancy':
            case 'loyalty':
            case 'reviews':
            case 'bookings':
                // TODO: Implement cho các loại báo cáo khác
                doc.text('Data not available', 14, 40);
                break;

            default:
                doc.text('Unknown report type', 14, 40);
        }

        doc.save(
            `${reportType}_report_${dateRange.startDate}_${dateRange.endDate}.pdf`,
        );
    };

    const exportToExcel = (reportData: any) => {
        let worksheetData: any[] = [];

        // Phân nhánh theo loại báo cáo
        switch (reportType) {
            case 'services':
                if (data && Array.isArray(data)) {
                    worksheetData = data.map((item: any) => ({
                        Date: item.date || '',
                        'Food & Beverage': item.foodBeverage || 0,
                        Laundry: item.laundry || 0,
                        Spa: item.spa || 0,
                        Transport: item.transport || 0,
                        Tour: item.tour || 0,
                        Others: item.others || 0,
                        'Total Orders': item.totalOrders || 0,
                        'Avg Order Value': item.avgOrderValue || 0,
                    }));
                }
                break;

            case 'revenue':
            case 'occupancy':
            case 'loyalty':
            case 'reviews':
            case 'bookings':
                // TODO: Implement cho các loại báo cáo khác
                worksheetData = [{ Message: 'Data not available' }];
                break;

            default:
                worksheetData = [{ Message: 'Unknown report type' }];
        }

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, reportType);
        XLSX.writeFile(
            workbook,
            `${reportType}_report_${dateRange.startDate}_${dateRange.endDate}.xlsx`,
        );
    };

    const handleExport = async (format: 'pdf' | 'excel') => {
        setLoading(true);
        try {
            if (!data || (Array.isArray(data) && data.length === 0)) {
                alert('No data available to export');
                return;
            }

            if (format === 'pdf') {
                exportToPDF(data);
            } else {
                exportToExcel(data);
            }

            setIsOpen(false);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#CCBDA3] text-white rounded-md hover:bg-[#b8ac94] transition disabled:opacity-50"
            >
                <FaDownload />
                {loading ? 'Exporting...' : 'Export Report'}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#EBE3D7] z-10">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F0EB] transition"
                    >
                        <FaFilePdf className="text-red-500" />
                        <span>Export as PDF</span>
                    </button>
                    <button
                        onClick={() => handleExport('excel')}
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
