/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
    FaChartLine,
    FaBed,
    FaStar,
    FaUsers,
    FaCalendarCheck,
    FaConciergeBell,
    FaChartBar,
    FaDollarSign,
    FaDoorOpen,
} from 'react-icons/fa';

import type {
    OccupancyData,
    ReviewData,
    ReportPeriod,
    ServiceData,
    RoomOccupancyData,
} from '../../../types/Report';

import OccupancyChart from '../../../components/report/OccupancyChart';
import RoomTypeAnalysis from '../../../components/report/RoomTypeAnalysis';
import ReviewChart from '../../../components/report/ReviewChart';
import RatingBreakdown from '../../../components/report/RatingBreakdown';
import SentimentAnalysis from '../../../components/report/SentimentAnalysis';
import DateRangePicker from '../../../components/report/DateRangePicker';
import FilterBar from '../../../components/report/FilterBar';
import ExportButton from '../../../components/report/ExportButton';
import OccupancyStats from '../../../components/report/OccupancyStats';

import ServiceSummary from '../../../components/report/ServiceSummary';
import ServiceChart from '../../../components/report/ServiceChart';
import ServiceDistribution from '../../../components/report/ServiceDistribution';
import PopularServices from '../../../components/report/PopularServices';

import {
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
} from 'recharts';

import { reportService } from '../../../services/reportService';

import RevenueTab from './components/RevenueTab';
import LoyaltyTab from './components/LoyaltyTab';
import BookingsTab from './components/BookingsTab';

/* -------------------------------------------------- */
/* ---------------- Report Tabs Type ---------------- */
/* -------------------------------------------------- */
type ReportTab =
    | 'revenue'
    | 'occupancy'
    | 'loyalty'
    | 'reviews'
    | 'bookings'
    | 'services';

const ReportPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ReportTab>('revenue');
    const [period, setPeriod] = useState<ReportPeriod>('monthly');

    // Get current date
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    const todayStr = `${currentYear}-${currentMonth}-${currentDay}`;

    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(todayStr);

    const [serviceData, setServiceData] = useState<ServiceData[]>([]);
    const [isLoadingServiceData, setIsLoadingServiceData] = useState(false);

    const [occupancyData, setOccupancyData] = useState<RoomOccupancyData[]>([]);
    const [isLoadingOccupancy, setIsLoadingOccupancy] = useState(false);

    const [reviewData, setReviewData] = useState<ReviewData[]>([]);
    const [isLoadingReview, setIsLoadingReview] = useState(false);

    const [showDateFilter, setShowDateFilter] = useState(false);

    /* -------------------------------------------------- */
    /* ------------ Auto update date range -------------- */
    /* -------------------------------------------------- */
    useEffect(() => {
        if (!showDateFilter) {
            const today = new Date();
            let start = new Date();
            let end = new Date();

            switch (period) {
                case 'daily':
                    start = today;
                    end = today;
                    break;

                case 'weekly':
                    start.setDate(today.getDate() - 6);
                    end = today;
                    break;

                case 'monthly':
                    start = new Date(today.getFullYear(), today.getMonth(), 1);
                    end = today;
                    break;

                case 'quarterly': {
                    const quarter = Math.floor(today.getMonth() / 3);
                    start = new Date(today.getFullYear(), quarter * 3, 1);
                    end = today;
                    break;
                }

                case 'yearly':
                    start = new Date(today.getFullYear(), 0, 1);
                    end = today;
                    break;
            }

            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            setStartDate(formatDate(start));
            setEndDate(formatDate(end));
        }
    }, [period, showDateFilter]);

    /* -------------------------------------------------- */
    /* ---------------- Fetch Service Report ------------ */
    /* -------------------------------------------------- */
    useEffect(() => {
        if (activeTab === 'services') {
            fetchServiceReport();
        }
        if (activeTab === 'occupancy') {
            fetchOccupancyReport();
        }
        if (activeTab === 'reviews') {
            fetchReviewReport();
        }
    }, [activeTab, startDate, endDate, period]);

    const fetchServiceReport = async () => {
        try {
            setIsLoadingServiceData(true);
            const data = await reportService.getServiceReport(
                startDate,
                endDate,
                period,
            );
            setServiceData(data);
        } catch (error) {
            console.error('Error fetching service report:', error);
        } finally {
            setIsLoadingServiceData(false);
        }
    };

    const fetchOccupancyReport = async () => {
        try {
            setIsLoadingOccupancy(true);
            const data = await reportService.getRoomOccupancyReport(
                startDate,
                endDate,
                period.toUpperCase(),
            );
            setOccupancyData(data);
        } catch (error) {
            console.error('Error fetching occupancy report:', error);
        } finally {
            setIsLoadingOccupancy(false);
        }
    };

    const fetchReviewReport = async () => {
        try {
            setIsLoadingReview(true);
            const data = await reportService.getReviewReport(
                startDate,
                endDate,
            );
            setReviewData(data);
        } catch (error) {
            console.error('Error fetching review report:', error);
        } finally {
            setIsLoadingReview(false);
        }
    };

    /* -------------------------------------------------- */
    /* ----------------- UI Tabs Config ----------------- */
    /* -------------------------------------------------- */
    const tabs = [
        {
            id: 'revenue' as ReportTab,
            label: 'Revenue Report',
            icon: <FaChartLine />,
            color: '#CCBDA3',
        },
        {
            id: 'occupancy' as ReportTab,
            label: 'Occupancy Report',
            icon: <FaBed />,
            color: '#2196F3',
        },
        {
            id: 'loyalty' as ReportTab,
            label: 'Loyalty Report',
            icon: <FaUsers />,
            color: '#FFD700',
        },
        {
            id: 'reviews' as ReportTab,
            label: 'Review Report',
            icon: <FaStar />,
            color: '#FF9800',
        },
        {
            id: 'bookings' as ReportTab,
            label: 'Booking Report',
            icon: <FaCalendarCheck />,
            color: '#00C853',
        },
        {
            id: 'services' as ReportTab,
            label: 'Service Report',
            icon: <FaConciergeBell />,
            color: '#9B59B6',
        },
    ];

    /* -------------------------------------------------- */
    /* ------------------- Render Tabs ------------------ */
    /* -------------------------------------------------- */
    const renderTabContent = () => {
        switch (activeTab) {
            case 'revenue':
                return (
                    <RevenueTab
                        startDate={startDate}
                        endDate={endDate}
                        period={period}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        onPeriodChange={setPeriod}
                        activeTab={activeTab}
                    />
                );

            case 'occupancy':
                return (
                    <div className="space-y-6">
                        {/* Filter Bar */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                <FilterBar
                                    period={period}
                                    onPeriodChange={setPeriod}
                                    showDateFilter={showDateFilter}
                                    setShowDateFilter={setShowDateFilter}
                                />
                                {showDateFilter && (
                                    <DateRangePicker
                                        startDate={startDate}
                                        endDate={endDate}
                                        onStartDateChange={setStartDate}
                                        onEndDateChange={setEndDate}
                                    />
                                )}
                                <ExportButton activeTab={activeTab} />
                            </div>
                        </div>

                        {isLoadingOccupancy ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Đang tải dữ liệu...
                                    </p>
                                </div>
                            </div>
                        ) : occupancyData.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <p className="text-lg">
                                    Không có dữ liệu trong khoảng thời gian này
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
                                    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Average Occupancy
                                            </h3>
                                            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                                                <FaChartLine className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {(
                                                occupancyData.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        item.occupancyRate,
                                                    0,
                                                ) / occupancyData.length
                                            ).toFixed(1)}
                                            %
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            Average for period
                                        </p>
                                    </div>

                                    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Total Booked Rooms
                                            </h3>
                                            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                                                <FaBed className="w-5 h-5 text-green-600 dark:text-green-300" />
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {occupancyData.reduce(
                                                (sum, item) =>
                                                    sum + item.bookedRooms,
                                                0,
                                            )}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            Out of{' '}
                                            {occupancyData[0]?.totalRooms || 0}{' '}
                                            rooms
                                        </p>
                                    </div>

                                    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Average Rate
                                            </h3>
                                            <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                                                <FaDoorOpen className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            $
                                            {(
                                                occupancyData.reduce(
                                                    (sum, item) =>
                                                        sum + item.averageRate,
                                                    0,
                                                ) / occupancyData.length
                                            ).toFixed(0)}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            Per room per night
                                        </p>
                                    </div>

                                    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Total Revenue
                                            </h3>
                                            <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900">
                                                <FaDollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            $
                                            {occupancyData
                                                .reduce(
                                                    (sum, item) =>
                                                        sum + item.totalRevenue,
                                                    0,
                                                )
                                                .toLocaleString()}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            Revenue from rooms
                                        </p>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                        Room Occupancy Chart
                                    </h3>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={400}
                                    >
                                        <ComposedChart data={occupancyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="period" />
                                            <YAxis yAxisId="left" />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                            />
                                            <Tooltip />
                                            <Legend />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="totalRooms"
                                                fill="#94a3b8"
                                                name="Total Rooms"
                                            />
                                            <Bar
                                                yAxisId="left"
                                                dataKey="bookedRooms"
                                                fill="#3b82f6"
                                                name="Booked Rooms"
                                            />
                                            <Line
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="occupancyRate"
                                                stroke="#ef4444"
                                                strokeWidth={2}
                                                name="Occupancy (%)"
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Table */}
                                <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                        Room Occupancy Details
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3"
                                                    >
                                                        Period
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-center"
                                                    >
                                                        Total Rooms
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-center"
                                                    >
                                                        Booked Rooms
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-center"
                                                    >
                                                        Occupancy (%)
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-right"
                                                    >
                                                        Avg Rate
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-right"
                                                    >
                                                        Revenue
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {occupancyData.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                        >
                                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                {item.period}
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                {
                                                                    item.totalRooms
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                {
                                                                    item.bookedRooms
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span
                                                                    className={`font-semibold ${
                                                                        item.occupancyRate >=
                                                                        80
                                                                            ? 'text-green-600 dark:text-green-400'
                                                                            : item.occupancyRate >=
                                                                              60
                                                                            ? 'text-blue-600 dark:text-blue-400'
                                                                            : item.occupancyRate >=
                                                                              40
                                                                            ? 'text-yellow-600 dark:text-yellow-400'
                                                                            : 'text-red-600 dark:text-red-400'
                                                                    }`}
                                                                >
                                                                    {item.occupancyRate.toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                $
                                                                {item.averageRate.toFixed(
                                                                    2,
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-right font-semibold">
                                                                $
                                                                {item.totalRevenue.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex items-center gap-6 mt-4 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                ≥ 80%: Excellent
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                60-79%: Good
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                40-59%: Average
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                &lt; 40%: Low
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );

            case 'loyalty':
                return (
                    <LoyaltyTab
                        startDate={startDate}
                        endDate={endDate}
                        period={period}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        onPeriodChange={setPeriod}
                        activeTab={activeTab}
                    />
                );

            case 'reviews':
                return (
                    <div className="space-y-6">
                        {/* Filter Bar for Reviews */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                <FilterBar
                                    period={period}
                                    onPeriodChange={setPeriod}
                                    showDateFilter={showDateFilter}
                                    setShowDateFilter={setShowDateFilter}
                                />
                                {showDateFilter && (
                                    <DateRangePicker
                                        startDate={startDate}
                                        endDate={endDate}
                                        onStartDateChange={setStartDate}
                                        onEndDateChange={setEndDate}
                                    />
                                )}
                                <ExportButton activeTab={activeTab} />
                            </div>
                        </div>

                        {isLoadingReview ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Đang tải dữ liệu...
                                    </p>
                                </div>
                            </div>
                        ) : reviewData.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <p className="text-lg">
                                    Không có dữ liệu trong khoảng thời gian này
                                </p>
                            </div>
                        ) : (
                            <>
                                <ReviewChart data={reviewData} />
                                <RatingBreakdown data={reviewData} />
                                <SentimentAnalysis data={reviewData} />
                            </>
                        )}
                    </div>
                );

            case 'bookings':
                return (
                    <BookingsTab
                        startDate={startDate}
                        endDate={endDate}
                        period={period}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                        onPeriodChange={setPeriod}
                    />
                );

            case 'services':
                return (
                    <div className="space-y-6">
                        {/* Filter Bar for Services */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                <FilterBar
                                    period={period}
                                    onPeriodChange={setPeriod}
                                    showDateFilter={showDateFilter}
                                    setShowDateFilter={setShowDateFilter}
                                />
                                {showDateFilter && (
                                    <DateRangePicker
                                        startDate={startDate}
                                        endDate={endDate}
                                        onStartDateChange={setStartDate}
                                        onEndDateChange={setEndDate}
                                    />
                                )}
                                <ExportButton activeTab={activeTab} />
                            </div>
                        </div>

                        <ServiceSummary
                            data={serviceData}
                            loading={isLoadingServiceData}
                        />
                        <ServiceChart
                            data={serviceData}
                            loading={isLoadingServiceData}
                        />
                        <ServiceDistribution
                            data={serviceData}
                            loading={isLoadingServiceData}
                        />
                        <PopularServices
                            data={serviceData}
                            loading={isLoadingServiceData}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Tabs selector */}
            <div className="flex gap-3 flex-wrap">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                            activeTab === tab.id
                                ? 'bg-black text-white'
                                : 'bg-white border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            {renderTabContent()}
        </div>
    );
};

export default ReportPage;
