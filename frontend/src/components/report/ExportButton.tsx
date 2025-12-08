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

    // Hàm chuyển đổi tiếng Việt có dấu sang không dấu
    const removeVietnameseTones = (str: string): string => {
        if (!str) return '';

        // Bảng mapping đầy đủ các ký tự tiếng Việt
        const from =
            'àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ';
        const to =
            'aaaaaaaaaaaaaaaaaeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyđAAAAAEEEIIOOOOUUADIUOaaaaaeeeeiiiioooooouuuadiuoUAAAAAAAAAAAAAEEEEEEuaaaaaaaaaaaaaaaaeeeeeeeEEIIOOOOOOOOOOOOOOOOUUUUUeeiioooooooooooooouuuuuUUUYYYYYuuuyyyyyyy';

        let result = str;
        for (let i = 0; i < from.length; i++) {
            result = result.replace(new RegExp(from[i], 'g'), to[i]);
        }

        return result;
    };

    const exportToPDF = (reportData: any) => {
        const doc = new jsPDF();

        // Sử dụng Times font - hỗ trợ Unicode tốt hơn Helvetica
        doc.setFont('times', 'normal');

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Lấy thông tin user từ localStorage
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const currentDate = new Date().toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

        // ============ HEADER - Logo và thông tin công ty ============
        doc.setFillColor(204, 189, 163); // #CCBDA3
        doc.rect(0, 0, pageWidth, 35, 'F');

        // Logo text (có thể thay bằng hình ảnh logo thực tế)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('times', 'bold');
        doc.text('VISTA HOTEL', 14, 15);

        doc.setFontSize(9);
        doc.setFont('times', 'normal');
        doc.text('Premium Hospitality Services', 14, 21);
        doc.text(
            'Phone: +84 123 456 789  |  Email: info@vistahotel.com',
            14,
            26,
        );
        doc.text(
            'Address: 123 Luxury Street, District 1, Ho Chi Minh City',
            14,
            31,
        );

        // ============ TIÊU ĐỀ BÁO CÁO ============
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(20);
        doc.setFont('times', 'bold');
        const reportTitle = `${reportType.toUpperCase()} REPORT`;
        const titleWidth = doc.getTextWidth(reportTitle);
        doc.text(reportTitle, (pageWidth - titleWidth) / 2, 48);

        // Đường kẻ dưới tiêu đề
        doc.setDrawColor(204, 189, 163);
        doc.setLineWidth(0.5);
        doc.line(14, 52, pageWidth - 14, 52);

        // ============ THÔNG TIN BÁO CÁO ============
        let yPos = 60;
        doc.setFontSize(10);
        doc.setFont('times', 'normal');

        // Khung thông tin
        doc.setDrawColor(204, 189, 163);
        doc.setFillColor(245, 240, 235); // #F5F0EB
        doc.roundedRect(14, yPos, pageWidth - 28, 35, 2, 2, 'FD');

        yPos += 7;
        doc.setFont('times', 'bold');
        doc.text('Reporting Period:', 18, yPos);
        doc.setFont('times', 'normal');
        doc.text(`${dateRange.startDate} to ${dateRange.endDate}`, 65, yPos);

        yPos += 7;
        doc.setFont('times', 'bold');
        doc.text('Generated Date:', 18, yPos);
        doc.setFont('times', 'normal');
        doc.text(currentDate, 65, yPos);

        yPos += 7;
        doc.setFont('times', 'bold');
        doc.text('Prepared By:', 18, yPos);
        doc.setFont('times', 'normal');
        // Sử dụng tên không dấu
        doc.text(removeVietnameseTones(user?.fullName || 'N/A'), 65, yPos);

        yPos += 7;
        doc.setFont('times', 'bold');
        doc.text('Department:', 18, yPos);
        doc.setFont('times', 'normal');
        doc.text(removeVietnameseTones(user?.department || 'N/A'), 65, yPos);
        doc.text(
            `Position: ${removeVietnameseTones(user?.position || 'N/A')}`,
            120,
            yPos,
        );

        yPos += 12;
        yPos += 12;

        // ============ NỘI DUNG BÁO CÁO - BẢNG DỮ LIỆU ============
        // Phân nhánh theo loại báo cáo
        switch (reportType) {
            case 'services':
                if (data && Array.isArray(data)) {
                    const tableData = data.map((item: any) => [
                        item.date || '',
                        item.foodBeverage?.toLocaleString('vi-VN') || '0',
                        item.laundry?.toLocaleString('vi-VN') || '0',
                        item.spa?.toLocaleString('vi-VN') || '0',
                        item.transport?.toLocaleString('vi-VN') || '0',
                        item.tour?.toLocaleString('vi-VN') || '0',
                        item.others?.toLocaleString('vi-VN') || '0',
                        item.totalOrders || '0',
                    ]);

                    // Tính tổng
                    const totals = data.reduce(
                        (acc: any, item: any) => ({
                            foodBeverage:
                                (acc.foodBeverage || 0) +
                                (item.foodBeverage || 0),
                            laundry: (acc.laundry || 0) + (item.laundry || 0),
                            spa: (acc.spa || 0) + (item.spa || 0),
                            transport:
                                (acc.transport || 0) + (item.transport || 0),
                            tour: (acc.tour || 0) + (item.tour || 0),
                            others: (acc.others || 0) + (item.others || 0),
                            totalOrders:
                                (acc.totalOrders || 0) +
                                (item.totalOrders || 0),
                        }),
                        {},
                    );

                    autoTable(doc, {
                        startY: yPos,
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
                        foot: [
                            [
                                'TOTAL',
                                totals.foodBeverage?.toLocaleString('vi-VN'),
                                totals.laundry?.toLocaleString('vi-VN'),
                                totals.spa?.toLocaleString('vi-VN'),
                                totals.transport?.toLocaleString('vi-VN'),
                                totals.tour?.toLocaleString('vi-VN'),
                                totals.others?.toLocaleString('vi-VN'),
                                totals.totalOrders?.toString(),
                            ],
                        ],
                        theme: 'striped',
                        headStyles: {
                            fillColor: [204, 189, 163],
                            textColor: [255, 255, 255],
                            fontStyle: 'bold',
                            fontSize: 9,
                            halign: 'center',
                        },
                        footStyles: {
                            fillColor: [204, 189, 163],
                            textColor: [255, 255, 255],
                            fontStyle: 'bold',
                            fontSize: 9,
                        },
                        bodyStyles: {
                            fontSize: 8,
                            cellPadding: 3,
                        },
                        alternateRowStyles: {
                            fillColor: [250, 248, 245],
                        },
                        margin: { left: 14, right: 14 },
                    });

                    yPos = (doc as any).lastAutoTable.finalY + 10;
                }
                break;

            case 'revenue':
            case 'occupancy':
            case 'loyalty':
            case 'reviews':
            case 'bookings':
                // TODO: Implement cho các loại báo cáo khác
                doc.setFontSize(10);
                doc.text('Data not available for this report type', 14, yPos);
                yPos += 10;
                break;

            default:
                doc.setFontSize(10);
                doc.text('Unknown report type', 14, yPos);
                yPos += 10;
        }

        // ============ CHỮ KÝ VÀ PHÊ DUYỆT ============
        const signatureY = pageHeight - 70;

        // Đường kẻ phân cách
        doc.setDrawColor(204, 189, 163);
        doc.setLineWidth(0.3);
        doc.line(14, signatureY - 5, pageWidth - 14, signatureY - 5);

        // Phần chữ ký
        doc.setFontSize(9);
        doc.setFont('times', 'bold');

        // Người lập báo cáo
        doc.text('PREPARED BY', 25, signatureY);
        doc.setFont('times', 'normal');
        doc.setFontSize(8);
        doc.text('(Report Preparer)', 21, signatureY + 5);
        doc.setFont('times', 'italic');
        doc.text('Signature:', 22, signatureY + 20);
        doc.line(22, signatureY + 21, 60, signatureY + 21);
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        // Sử dụng tên không dấu
        doc.text(
            removeVietnameseTones(user?.fullName || 'N/A'),
            22,
            signatureY + 27,
        );
        doc.setFont('times', 'normal');
        doc.setFontSize(8);
        doc.text(
            removeVietnameseTones(user?.position || ''),
            22,
            signatureY + 32,
        );

        // Người phê duyệt
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.text('APPROVED BY', pageWidth / 2 - 15, signatureY);
        doc.setFont('times', 'normal');
        doc.setFontSize(8);
        doc.text('(Approver)', pageWidth / 2 - 12, signatureY + 5);
        doc.setFont('times', 'italic');
        doc.setFontSize(8);
        doc.text('Signature:', pageWidth / 2 - 15, signatureY + 20);
        doc.line(
            pageWidth / 2 - 15,
            signatureY + 21,
            pageWidth / 2 + 23,
            signatureY + 21,
        );
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.text('_________________', pageWidth / 2 - 15, signatureY + 27);
        doc.setFont('times', 'normal');
        doc.setFontSize(8);
        doc.text('Manager', pageWidth / 2 - 15, signatureY + 32);

        // Giám đốc
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.text('AUTHORIZED BY', pageWidth - 52, signatureY);
        doc.setFont('times', 'normal');
        doc.setFontSize(8);
        doc.text('(Director)', pageWidth - 45, signatureY + 5);
        doc.setFont('times', 'italic');
        doc.setFontSize(8);
        doc.text('Signature:', pageWidth - 50, signatureY + 20);
        doc.line(
            pageWidth - 50,
            signatureY + 21,
            pageWidth - 12,
            signatureY + 21,
        );
        doc.setFont('times', 'bold');
        doc.setFontSize(9);
        doc.text('_________________', pageWidth - 50, signatureY + 27);
        doc.setFont('times', 'normal');
        doc.setFontSize(8);
        doc.text('Director', pageWidth - 50, signatureY + 32);

        // ============ FOOTER ============
        const footerY = pageHeight - 15;
        doc.setFillColor(204, 189, 163);
        doc.rect(0, footerY - 5, pageWidth, 20, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont('times', 'italic');
        const footerText =
            'This is a computer-generated report - Vista Hotel Management System';
        const footerWidth = doc.getTextWidth(footerText);
        doc.text(footerText, (pageWidth - footerWidth) / 2, footerY);

        doc.setFontSize(6);
        doc.text(
            `Page 1 | Generated on ${currentDate}`,
            (pageWidth -
                doc.getTextWidth(`Page 1 | Generated on ${currentDate}`)) /
                2,
            footerY + 4,
        );

        doc.text(
            'Confidential Document - For Internal Use Only',
            (pageWidth -
                doc.getTextWidth(
                    'Confidential Document - For Internal Use Only',
                )) /
                2,
            footerY + 8,
        );

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
