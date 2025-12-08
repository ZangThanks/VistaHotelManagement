/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import {
    FaChartLine,
    FaBed,
    FaStar,
    FaUsers,
    FaCalendarCheck,
    FaConciergeBell,
} from 'react-icons/fa';
import type {
    OccupancyData,
    LoyaltyData,
    ReviewData,
    BookingData,
    ReportPeriod,
    ServiceData,
    RevenueData,
} from '../../../types/Report';
import OccupancyChart from '../../../components/report/OccupancyChart';
import RoomTypeAnalysis from '../../../components/report/RoomTypeAnalysis';
import LoyaltyChart from '../../../components/report/LoyaltyChart';
import MembershipDistribution from '../../../components/report/MembershipDistribution';
import ReviewChart from '../../../components/report/ReviewChart';
import RatingBreakdown from '../../../components/report/RatingBreakdown';
import SentimentAnalysis from '../../../components/report/SentimentAnalysis';
import BookingTrends from '../../../components/report/BookingTrends';
import BookingChart from '../../../components/report/BookingChart';
import DateRangePicker from '../../../components/report/DateRangePicker';
import FilterBar from '../../../components/report/FilterBar';
import ExportButton from '../../../components/report/ExportButton';
import OccupancyStats from '../../../components/report/OccupancyStats';
import ServiceSummary from '../../../components/report/ServiceSummary';
import ServiceChart from '../../../components/report/ServiceChart';
import ServiceDistribution from '../../../components/report/ServiceDistribution';
import PopularServices from '../../../components/report/PopularServices';
import { reportService } from '../../../services/reportService';
import RevenueTab from './components/RevenueTab';
import { getRevenueData } from '../../../services/revenueReportService';
import LoyaltySummary from "../../../components/report/LoyaltySummary";
import {
  exportLoyaltyToPDF,
  exportLoyaltyToExcel,
} from "../../../utils/exportUtils";

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
    // const [startDate, setStartDate] = useState("2024-01-01");
    // const [endDate, setEndDate] = useState("2024-12-31");

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
    const [showDateFilter, setShowDateFilter] = useState(false);

    const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
    const [revenueLoading, setRevenueLoading] = useState<boolean>(false);
    const [revenueError, setRevenueError] = useState<string | null>(null);

    // Auto update date range when period changes
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
                case 'quarterly':
                    const quarter = Math.floor(today.getMonth() / 3);
                    start = new Date(today.getFullYear(), quarter * 3, 1);
                    end = today;
                    break;
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

    // State for API data
    const [loyaltyData, setLoyaltyData] = useState<LoyaltyData[]>([]);
    const [bookingData, setBookingData] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Fetch service report data from API
    useEffect(() => {
        if (activeTab === 'services') {
            fetchServiceReport();
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

    useEffect(() => {
        const fetchRevenue = async () => {
            setRevenueLoading(true);
            setRevenueError(null);
            try {
                const data = await getRevenueData();
                setRevenueData(Array.isArray(data) ? data : []);
            } catch (e: any) {
                setRevenueError(e?.message || 'Failed to load revenue data');
                setRevenueData([]);
            } finally {
                setRevenueLoading(false);
            }
        };
        fetchRevenue();
    }, []);

    // Mock data - Occupancy
    const occupancyData: OccupancyData[] = useMemo(
        () => [
            {
                date: 'Jan 2024',
                totalRooms: 105,
                occupiedRooms: 78,
                occupancyRate: 74.3,
            },
            {
                date: 'Feb 2024',
                totalRooms: 105,
                occupiedRooms: 82,
                occupancyRate: 78.1,
            },
            {
                date: 'Mar 2024',
                totalRooms: 105,
                occupiedRooms: 88,
                occupancyRate: 83.8,
            },
            {
                date: 'Apr 2024',
                totalRooms: 105,
                occupiedRooms: 84,
                occupancyRate: 80.0,
            },
            {
                date: 'May 2024',
                totalRooms: 105,
                occupiedRooms: 86,
                occupancyRate: 81.9,
            },
            {
                date: 'Jun 2024',
                totalRooms: 105,
                occupiedRooms: 95,
                occupancyRate: 90.5,
            },
            {
                date: 'Jul 2024',
                totalRooms: 105,
                occupiedRooms: 98,
                occupancyRate: 93.3,
            },
            {
                date: 'Aug 2024',
                totalRooms: 105,
                occupiedRooms: 96,
                occupancyRate: 91.4,
            },
            {
                date: 'Sep 2024',
                totalRooms: 105,
                occupiedRooms: 89,
                occupancyRate: 84.8,
            },
            {
                date: 'Oct 2024',
                totalRooms: 105,
                occupiedRooms: 87,
                occupancyRate: 82.9,
            },
            {
                date: 'Nov 2024',
                totalRooms: 105,
                occupiedRooms: 85,
                occupancyRate: 81.0,
            },
            {
                date: 'Dec 2024',
                totalRooms: 105,
                occupiedRooms: 100,
                occupancyRate: 95.2,
            },
        ],
        [],
    );

    // Fetch Loyalty Data from API
    useEffect(() => {
        const fetchLoyaltyData = async () => {
            if (activeTab !== 'loyalty') return;

            setLoading(true);
            setError(null);
            try {
                const data = await reportService.getLoyaltyReport(
                    startDate,
                    endDate,
                    period.toUpperCase(),
                );
                setLoyaltyData(data);
            } catch (err) {
                console.error('Failed to fetch loyalty report:', err);
                setError('Failed to load loyalty data. Using sample data.');
            } finally {
                setLoading(false);
            }
        };

        fetchLoyaltyData();
    }, [activeTab, startDate, endDate, period]);

    // Fetch Booking Data from API
    useEffect(() => {
        const fetchBookingData = async () => {
            if (activeTab !== 'bookings') return;

            setLoading(true);
            setError(null);
            try {
                const data = await reportService.getBookingReport(
                    startDate,
                    endDate,
                    period.toUpperCase(),
                );
                setBookingData(data);
            } catch (err) {
                console.error('Failed to fetch booking report:', err);
                setError('Failed to load booking data.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
    }, [activeTab, startDate, endDate, period]);

    // Handle export
    const handleExport = (format: 'pdf' | 'excel') => {
        const dateRangeText = `${startDate} to ${endDate}`;

        if (activeTab === 'loyalty') {
            if (format === 'pdf') {
                exportLoyaltyToPDF(loyaltyData, dateRangeText);
            } else {
                exportLoyaltyToExcel(loyaltyData, dateRangeText);
            }
        }
        // Add other report types here in the future
    };

    // Mock data - Reviews
    const reviewData: ReviewData[] = useMemo(
        () => [
            {
                date: 'Jan 2024',
                averageRating: 4.3,
                totalReviews: 142,
                roomQuality: 4.5,
                service: 4.4,
                location: 4.2,
                value: 4.1,
                sentimentScore: 0.78,
            },
            {
                date: 'Feb 2024',
                averageRating: 4.4,
                totalReviews: 158,
                roomQuality: 4.6,
                service: 4.5,
                location: 4.3,
                value: 4.2,
                sentimentScore: 0.82,
            },
            {
                date: 'Mar 2024',
                averageRating: 4.5,
                totalReviews: 175,
                roomQuality: 4.7,
                service: 4.6,
                location: 4.4,
                value: 4.3,
                sentimentScore: 0.85,
            },
            {
                date: 'Apr 2024',
                averageRating: 4.4,
                totalReviews: 165,
                roomQuality: 4.6,
                service: 4.5,
                location: 4.3,
                value: 4.2,
                sentimentScore: 0.81,
            },
            {
                date: 'May 2024',
                averageRating: 4.5,
                totalReviews: 170,
                roomQuality: 4.7,
                service: 4.6,
                location: 4.4,
                value: 4.3,
                sentimentScore: 0.83,
            },
            {
                date: 'Jun 2024',
                averageRating: 4.6,
                totalReviews: 188,
                roomQuality: 4.8,
                service: 4.7,
                location: 4.5,
                value: 4.4,
                sentimentScore: 0.87,
            },
        ],
        [],
    );

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
                        <OccupancyStats data={occupancyData} />
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <h3 className="text-lg font-semibold mb-4">
                                Occupancy Trends
                            </h3>
                            <OccupancyChart data={occupancyData} />
                        </div>
                        <RoomTypeAnalysis />
                    </div>
                );

            case 'loyalty':
                return (
                    <div className="space-y-6">
                        {/* Loading State */}
                        {loading && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                                <p className="text-blue-700 font-medium">
                                    Loading loyalty data...
                                </p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                                <p className="text-yellow-700 font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Data Display */}
                        {!loading && loyaltyData.length > 0 && (
                            <>
                                {/* Summary Statistics */}
                                <LoyaltySummary data={loyaltyData} />

                                {/* Charts Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                                        <h3 className="text-lg font-semibold mb-4">
                                            Membership Growth Trend
                                        </h3>
                                        <LoyaltyChart data={loyaltyData} />
                                    </div>
                                    <MembershipDistribution
                                        data={loyaltyData}
                                    />
                                </div>
                            </>
                        )}

                        {/* No Data State */}
                        {!loading && loyaltyData.length === 0 && !error && (
                            <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg text-center">
                                <p className="text-gray-600">
                                    No loyalty data available for the selected
                                    period.
                                </p>
                            </div>
                        )}
                    </div>
                );
            case 'reviews':
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <h3 className="text-lg font-semibold mb-4">
                                Average Rating Over Time
                            </h3>
                            <ReviewChart data={reviewData} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <RatingBreakdown data={reviewData} />
                            <SentimentAnalysis data={reviewData} />
                        </div>
                    </div>
                );

            case 'bookings':
                return (
                    <div className="space-y-6">
                        <BookingTrends data={bookingData} />
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <h3 className="text-lg font-semibold mb-4">
                                Booking Trends Over Time
                            </h3>
                            <BookingChart data={bookingData} />
                        </div>
                    </div>
                );

            case 'services':
                return (
                    <>
                        {/* Filters */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EBE3D7] mb-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <FilterBar
                                        period={period}
                                        onPeriodChange={setPeriod}
                                        showDateFilter={false}
                                        onToggleDateFilter={undefined}
                                    />

                                    <button
                                        onClick={() =>
                                            setShowDateFilter(!showDateFilter)
                                        }
                                        className={`px-4 py-2 rounded-md font-medium transition flex items-center gap-2 ${
                                            showDateFilter
                                                ? 'bg-[#B8935F] text-white hover:bg-[#9A7A4D]'
                                                : 'bg-white text-gray-700 border border-[#EBE3D7] hover:bg-[#F5F0EB]'
                                        }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Date Filter
                                    </button>

                                    {showDateFilter && (
                                        <DateRangePicker
                                            startDate={startDate}
                                            endDate={endDate}
                                            onStartDateChange={setStartDate}
                                            onEndDateChange={setEndDate}
                                        />
                                    )}
                                </div>

                                <ExportButton
                                    reportType={activeTab}
                                    dateRange={{ startDate, endDate }}
                                    data={
                                        activeTab === 'services'
                                            ? serviceData
                                            : undefined
                                    }
                                />
                            </div>
                        </div>

                        {/* Service Content */}
                        <div className="space-y-6">
                            {isLoadingServiceData ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCBDA3]"></div>
                                </div>
                            ) : serviceData.length > 0 ? (
                                <>
                                    <ServiceSummary data={serviceData} />

                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                                        <h3 className="text-lg font-semibold mb-4">
                                            Service Revenue Trends
                                        </h3>
                                        <ServiceChart data={serviceData} />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <ServiceDistribution
                                            data={serviceData}
                                        />
                                        <PopularServices data={serviceData} />
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white p-12 rounded-lg shadow-sm border border-[#EBE3D7] text-center">
                                    <p className="text-gray-500">
                                        No service data available for the
                                        selected period
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F0EB] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-playfair font-bold mb-2">
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600">
                        Comprehensive insights into hotel performance
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-[#EBE3D7] mb-6">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition border-b-2 ${
                                    activeTab === tab.id
                                        ? 'border-[#CCBDA3] text-[#CCBDA3]'
                                        : 'border-transparent text-gray-600 hover:text-[#CCBDA3]'
                                }`}
                            >
                                <span
                                    style={{
                                        color:
                                            activeTab === tab.id
                                                ? tab.color
                                                : 'inherit',
                                    }}
                                >
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div>{renderTabContent()}</div>
            </div>
        </div>
    );
};

export default ReportPage;
