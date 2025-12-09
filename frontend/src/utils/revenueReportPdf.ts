import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { RevenueData } from '../types/Report';

interface RevenueReportOptions {
    data: RevenueData[];
    startDate: string;
    endDate: string;
    period: string;
    preparedBy: string;
}

// Helper function to get period-specific labels and title
const getPeriodConfig = (period: string) => {
    switch (period) {
        case 'daily':
            return {
                title: 'DAILY REVENUE REPORT',
                columnLabel: 'Date',
                subtitle: 'Daily Revenue Statistics',
            };
        case 'weekly':
            return {
                title: 'WEEKLY REVENUE REPORT',
                columnLabel: 'Week',
                subtitle: 'Weekly Revenue Statistics',
            };
        case 'monthly':
            return {
                title: 'MONTHLY REVENUE REPORT',
                columnLabel: 'Month',
                subtitle: 'Monthly Revenue Statistics',
            };
        case 'quarterly':
            return {
                title: 'QUARTERLY REVENUE REPORT',
                columnLabel: 'Quarter',
                subtitle: 'Quarterly Revenue Statistics',
            };
        case 'yearly':
            return {
                title: 'YEARLY REVENUE REPORT',
                columnLabel: 'Year',
                subtitle: 'Yearly Revenue Statistics',
            };
        default:
            return {
                title: 'REVENUE REPORT',
                columnLabel: 'Period',
                subtitle: 'Custom Date Range Statistics',
            };
    }
};

export const generateRevenueReportPdf = ({
    data,
    startDate,
    endDate,
    period,
    preparedBy,
}: RevenueReportOptions) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors - Vista Hotel Theme
    const headerBg: [number, number, number] = [204, 189, 163]; // #CCBDA3 - Beige
    const tableBorderColor: [number, number, number] = [180, 165, 140];
    const tableHeaderBg: [number, number, number] = [235, 227, 215]; // #EBE3D7
    const totalRowBg: [number, number, number] = [204, 189, 163]; // #CCBDA3
    const darkText: [number, number, number] = [51, 51, 51];
    const white: [number, number, number] = [255, 255, 255];
    const accentColor: [number, number, number] = [184, 147, 95]; // #B8935F

    // Get period-specific configuration
    const periodConfig = getPeriodConfig(period);

    // Current date and time
    const now = new Date();
    const formattedDateTime = `${String(now.getHours()).padStart(
        2,
        '0',
    )}:${String(now.getMinutes()).padStart(2, '0')} ${String(
        now.getDate(),
    ).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(
        2,
        '0',
    )}/${now.getFullYear()}`;

    // === HEADER SECTION ===
    doc.setFillColor(...headerBg);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Hotel Name
    doc.setTextColor(...white);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('VISTA HOTEL', 15, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Premium Hospitality Services', 15, 25);
    doc.setFontSize(8);
    doc.text('Phone: +84 123 456 789 | Email: info@vistahotel.com', 15, 31);
    doc.text(
        'Address: 123 Luxury Street, District 1, Ho Chi Minh City',
        15,
        36,
    );

    // === REPORT TITLE ===
    doc.setTextColor(...darkText);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(periodConfig.title, pageWidth / 2, 52, { align: 'center' });

    // Subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accentColor);
    doc.text(periodConfig.subtitle, pageWidth / 2, 58, { align: 'center' });

    // === REPORT INFORMATION BOX ===
    doc.setDrawColor(...tableBorderColor);
    doc.setLineWidth(0.5);
    doc.rect(15, 64, pageWidth - 30, 28);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);

    // Left column labels
    doc.text('Reporting Period:', 20, 72);
    doc.text('Generated Date:', 20, 79);
    doc.text('Prepared By:', 20, 86);

    // Left column values
    doc.setFont('helvetica', 'normal');
    doc.text(`${startDate} to ${endDate}`, 55, 72);
    doc.text(formattedDateTime, 55, 79);
    doc.text(preparedBy, 55, 86);

    // Right column
    doc.setFont('helvetica', 'bold');
    doc.text('Report Type:', 115, 72);
    doc.text('Department:', 115, 79);
    doc.text('Position:', 115, 86);

    doc.setFont('helvetica', 'normal');
    doc.text(period.charAt(0).toUpperCase() + period.slice(1), 150, 72);
    doc.text('Finance', 150, 79);
    doc.text('Administrator', 150, 86);

    // === TABLE SECTION ===
    // Define headers based on period type
    const headers = [
        periodConfig.columnLabel,
        'Room Revenue',
        'Service Revenue',
        'Total Revenue',
        'Bookings',
        'Avg/Booking',
    ];

    // Prepare table data with formatted values
    const tableData = data.map((item) => {
        const avgPerBooking =
            item.bookingCount && item.bookingCount > 0
                ? Math.round(item.totalRevenue / item.bookingCount)
                : 0;

        return [
            item.label || item.date || 'N/A',
            (item.roomRevenue || 0).toLocaleString('vi-VN'),
            (item.serviceRevenue || 0).toLocaleString('vi-VN'),
            item.totalRevenue.toLocaleString('vi-VN'),
            (item.bookingCount || 0).toString(),
            avgPerBooking.toLocaleString('vi-VN'),
        ];
    });

    // Calculate totals
    const totalRoomRevenue = data.reduce(
        (sum, item) => sum + (item.roomRevenue || 0),
        0,
    );
    const totalServiceRevenue = data.reduce(
        (sum, item) => sum + (item.serviceRevenue || 0),
        0,
    );
    const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalBookings = data.reduce(
        (sum, item) => sum + (item.bookingCount || 0),
        0,
    );
    const totalAvgPerBooking =
        totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

    // Add total row
    tableData.push([
        'TOTAL',
        totalRoomRevenue.toLocaleString('vi-VN'),
        totalServiceRevenue.toLocaleString('vi-VN'),
        totalRevenue.toLocaleString('vi-VN'),
        totalBookings.toString(),
        totalAvgPerBooking.toLocaleString('vi-VN'),
    ]);

    // Generate table
    autoTable(doc, {
        startY: 97,
        head: [headers],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: tableHeaderBg,
            textColor: darkText,
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle',
            lineWidth: 0.3,
            lineColor: tableBorderColor,
            cellPadding: 2.5,
        },
        bodyStyles: {
            fontSize: 8,
            textColor: darkText,
            halign: 'center',
            valign: 'middle',
            lineWidth: 0.3,
            lineColor: tableBorderColor,
            cellPadding: 2.5,
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 28 },
            1: { halign: 'right', cellWidth: 30 },
            2: { halign: 'right', cellWidth: 30 },
            3: { halign: 'right', cellWidth: 30 },
            4: { halign: 'center', cellWidth: 20 },
            5: { halign: 'right', cellWidth: 28 },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        didParseCell: (cellData: any) => {
            if (
                cellData.row.index === tableData.length - 1 &&
                cellData.section === 'body'
            ) {
                cellData.cell.styles.fillColor = totalRowBg;
                cellData.cell.styles.fontStyle = 'bold';
                cellData.cell.styles.textColor = darkText;
            }
        },
        margin: { left: 15, right: 15 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Get the final Y position after table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY + 12;

    // === SUMMARY SECTION ===
    const summaryY = finalY;
    const boxWidth = (pageWidth - 45) / 3;

    // Summary boxes with Vista Hotel colors
    const summaries = [
        {
            label: 'Total Revenue',
            value: totalRevenue.toLocaleString('vi-VN') + ' ₫',
            bgColor: accentColor,
        },
        {
            label: 'Total Bookings',
            value: totalBookings.toString(),
            bgColor: headerBg,
        },
        {
            label: 'Avg. Per Booking',
            value: totalAvgPerBooking.toLocaleString('vi-VN') + ' ₫',
            bgColor: [160, 145, 120] as [number, number, number],
        },
    ];

    summaries.forEach((item, index) => {
        const x = 15 + index * (boxWidth + 7.5);
        doc.setFillColor(...item.bgColor);
        doc.roundedRect(x, summaryY, boxWidth, 18, 2, 2, 'F');

        doc.setTextColor(...white);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(item.label, x + boxWidth / 2, summaryY + 6, {
            align: 'center',
        });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(item.value, x + boxWidth / 2, summaryY + 13, {
            align: 'center',
        });
    });

    // === SIGNATURE SECTION ===
    const sigY = summaryY + 28;
    const sigWidth = 50;
    const col1X = 20;
    const col2X = pageWidth / 2 - sigWidth / 2;
    const col3X = pageWidth - 20 - sigWidth;

    // Draw separator line
    doc.setDrawColor(...tableBorderColor);
    doc.setLineWidth(0.3);
    doc.line(15, sigY - 5, pageWidth - 15, sigY - 5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);

    // Column 1: Prepared By
    doc.text('PREPARED BY', col1X, sigY);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('(Report Preparer)', col1X, sigY + 4);

    doc.setFontSize(8);
    doc.text('Signature:', col1X, sigY + 18);
    doc.setDrawColor(...darkText);
    doc.setLineWidth(0.2);
    doc.line(col1X + 18, sigY + 18, col1X + sigWidth, sigY + 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(preparedBy, col1X, sigY + 26);

    // Column 2: Reviewed By
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('REVIEWED BY', col2X, sigY);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('(Manager)', col2X, sigY + 4);

    doc.text('Signature:', col2X, sigY + 18);
    doc.line(col2X + 18, sigY + 18, col2X + sigWidth, sigY + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('________________', col2X, sigY + 26);

    // Column 3: Approved By
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('APPROVED BY', col3X, sigY);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('(Director)', col3X, sigY + 4);

    doc.text('Signature:', col3X, sigY + 18);
    doc.line(col3X + 18, sigY + 18, col3X + sigWidth, sigY + 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('________________', col3X, sigY + 26);

    // === FOOTER ===
    doc.setFillColor(...headerBg);
    doc.rect(0, pageHeight - 14, pageWidth, 14, 'F');

    doc.setTextColor(...darkText);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text(
        'Vista Hotel Management System - Confidential Document',
        pageWidth / 2,
        pageHeight - 9,
        { align: 'center' },
    );
    doc.text(
        `Page 1 | Generated on ${formattedDateTime}`,
        pageWidth / 2,
        pageHeight - 4,
        { align: 'center' },
    );

    // Save the PDF
    const fileName = `Vista_${periodConfig.title.replace(
        /\s+/g,
        '_',
    )}_${startDate}_to_${endDate}.pdf`;
    doc.save(fileName);
};
