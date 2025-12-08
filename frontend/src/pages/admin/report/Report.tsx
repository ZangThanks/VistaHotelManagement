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
    RevenueData,
    OccupancyData,
    LoyaltyData,
    BookingData,
    ReportPeriod,
    ServiceData,
} from '../../../types/Report';
import RevenueSummary from '../../../components/report/RevenueSummary';
import RevenueChart from '../../../components/report/RevenueChart';
import OccupancyChart from '../../../components/report/OccupancyChart';
import RoomTypeAnalysis from '../../../components/report/RoomTypeAnalysis';
import LoyaltyChart from '../../../components/report/LoyaltyChart';
import MembershipDistribution from '../../../components/report/MembershipDistribution';
import PointsRedemption from '../../../components/report/PointsRedemption';
import ReviewChart from '../../../components/report/ReviewChart';
import RatingBreakdown from '../../../components/report/RatingBreakdown';
import SentimentAnalysis from '../../../components/report/SentimentAnalysis';
import BookingTrends from '../../../components/report/BookingTrends';
import BookingChart from '../../../components/report/BookingChart';
import ChannelAnalysis from '../../../components/report/ChannelAnalysis';
import DateRangePicker from '../../../components/report/DateRangePicker';
import FilterBar from '../../../components/report/FilterBar';
import ExportButton from '../../../components/report/ExportButton';
import OccupancyStats from '../../../components/report/OccupancyStats';
import ServiceSummary from '../../../components/report/ServiceSummary';
import ServiceChart from '../../../components/report/ServiceChart';
import ServiceDistribution from '../../../components/report/ServiceDistribution';
import PopularServices from '../../../components/report/PopularServices';
import {
    getRatingTrend,
    getCategoryRatings,
    getSentimentStats,
} from '../../../services/reviewService';

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
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-12-31');

    //TODO: DATA MẪU!!

    // Mock data - Revenue
    const revenueData: RevenueData[] = useMemo(
        () => [
            {
                date: 'Jan 2024',
                roomRevenue: 450000000,
                serviceRevenue: 120000000,
                totalRevenue: 570000000,
                bookingCount: 285,
            },
            {
                date: 'Feb 2024',
                roomRevenue: 480000000,
                serviceRevenue: 135000000,
                totalRevenue: 615000000,
                bookingCount: 310,
            },
            {
                date: 'Mar 2024',
                roomRevenue: 520000000,
                serviceRevenue: 148000000,
                totalRevenue: 668000000,
                bookingCount: 335,
            },
            {
                date: 'Apr 2024',
                roomRevenue: 495000000,
                serviceRevenue: 142000000,
                totalRevenue: 637000000,
                bookingCount: 318,
            },
            {
                date: 'May 2024',
                roomRevenue: 510000000,
                serviceRevenue: 155000000,
                totalRevenue: 665000000,
                bookingCount: 328,
            },
            {
                date: 'Jun 2024',
                roomRevenue: 580000000,
                serviceRevenue: 168000000,
                totalRevenue: 748000000,
                bookingCount: 375,
            },
            {
                date: 'Jul 2024',
                roomRevenue: 620000000,
                serviceRevenue: 182000000,
                totalRevenue: 802000000,
                bookingCount: 402,
            },
            {
                date: 'Aug 2024',
                roomRevenue: 595000000,
                serviceRevenue: 175000000,
                totalRevenue: 770000000,
                bookingCount: 388,
            },
            {
                date: 'Sep 2024',
                roomRevenue: 540000000,
                serviceRevenue: 160000000,
                totalRevenue: 700000000,
                bookingCount: 352,
            },
            {
                date: 'Oct 2024',
                roomRevenue: 525000000,
                serviceRevenue: 152000000,
                totalRevenue: 677000000,
                bookingCount: 340,
            },
            {
                date: 'Nov 2024',
                roomRevenue: 505000000,
                serviceRevenue: 145000000,
                totalRevenue: 650000000,
                bookingCount: 325,
            },
            {
                date: 'Dec 2024',
                roomRevenue: 630000000,
                serviceRevenue: 195000000,
                totalRevenue: 825000000,
                bookingCount: 415,
            },
        ],
        [],
    );

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

    // Mock data - Loyalty
    const loyaltyData: LoyaltyData[] = useMemo(
        () => [
            {
                month: 'Jan',
                bronze: 420,
                silver: 250,
                gold: 130,
                platinum: 38,
                totalPoints: 125000,
                redemptions: 45000,
            },
            {
                month: 'Feb',
                bronze: 425,
                silver: 255,
                gold: 135,
                platinum: 40,
                totalPoints: 132000,
                redemptions: 48000,
            },
            {
                month: 'Mar',
                bronze: 430,
                silver: 260,
                gold: 138,
                platinum: 42,
                totalPoints: 138000,
                redemptions: 52000,
            },
            {
                month: 'Apr',
                bronze: 435,
                silver: 265,
                gold: 142,
                platinum: 43,
                totalPoints: 142000,
                redemptions: 55000,
            },
            {
                month: 'May',
                bronze: 440,
                silver: 270,
                gold: 145,
                platinum: 44,
                totalPoints: 148000,
                redemptions: 58000,
            },
            {
                month: 'Jun',
                bronze: 445,
                silver: 275,
                gold: 148,
                platinum: 45,
                totalPoints: 155000,
                redemptions: 62000,
            },
        ],
        [],
    );

    // Data - Reviews
    const [reviewTrend, setReviewTrend] = useState([]);
    const [categoryRatings, setCategoryRatings] = useState(null);
    const [sentimentStats, setSentimentStats] = useState(null);
    useEffect(() => {
        // Load line chart
        getRatingTrend().then((res) => {
            // Backend returns: [{month: "2024-06", avgRating: 4.65}]
            setReviewTrend(res || []);
        });

        // Load bar chart
        getCategoryRatings().then((res) => {
            setCategoryRatings(res);
        });

        // Load pie chart
        getSentimentStats().then((res) => {
            setSentimentStats(res);
        });
    }, []);

    // Mock data - Bookings
    const bookingData: BookingData[] = useMemo(
        () => [
            {
                date: 'Jan 2024',
                website: 180,
                phone: 75,
                walkin: 30,
                totalBookings: 285,
                cancellationRate: 8.5,
            },
            {
                date: 'Feb 2024',
                website: 195,
                phone: 82,
                walkin: 33,
                totalBookings: 310,
                cancellationRate: 7.8,
            },
            {
                date: 'Mar 2024',
                website: 215,
                phone: 88,
                walkin: 32,
                totalBookings: 335,
                cancellationRate: 6.9,
            },
            {
                date: 'Apr 2024',
                website: 205,
                phone: 80,
                walkin: 33,
                totalBookings: 318,
                cancellationRate: 7.2,
            },
            {
                date: 'May 2024',
                website: 210,
                phone: 85,
                walkin: 33,
                totalBookings: 328,
                cancellationRate: 6.8,
            },
            {
                date: 'Jun 2024',
                website: 242,
                phone: 95,
                walkin: 38,
                totalBookings: 375,
                cancellationRate: 5.5,
            },
            {
                date: 'Jul 2024',
                website: 258,
                phone: 102,
                walkin: 42,
                totalBookings: 402,
                cancellationRate: 5.2,
            },
            {
                date: 'Aug 2024',
                website: 248,
                phone: 98,
                walkin: 42,
                totalBookings: 388,
                cancellationRate: 5.8,
            },
            {
                date: 'Sep 2024',
                website: 225,
                phone: 90,
                walkin: 37,
                totalBookings: 352,
                cancellationRate: 6.5,
            },
            {
                date: 'Oct 2024',
                website: 218,
                phone: 87,
                walkin: 35,
                totalBookings: 340,
                cancellationRate: 6.8,
            },
            {
                date: 'Nov 2024',
                website: 208,
                phone: 83,
                walkin: 34,
                totalBookings: 325,
                cancellationRate: 7.1,
            },
            {
                date: 'Dec 2024',
                website: 268,
                phone: 105,
                walkin: 42,
                totalBookings: 415,
                cancellationRate: 4.8,
            },
        ],
        [],
    );
    // Mock data - Services
    const serviceData: ServiceData[] = useMemo(
        () => [
            {
                date: 'Jan 2024',
                foodBeverage: 85000000,
                laundry: 28000000,
                spa: 45000000,
                transport: 12000000,
                tour: 22000000,
                others: 18000000,
                totalOrders: 420,
                avgOrderValue: 311904,
            },
            {
                date: 'Feb 2024',
                foodBeverage: 92000000,
                laundry: 31000000,
                spa: 48000000,
                transport: 14000000,
                tour: 25000000,
                others: 20000000,
                totalOrders: 455,
                avgOrderValue: 314285,
            },
            {
                date: 'Mar 2024',
                foodBeverage: 98000000,
                laundry: 35000000,
                spa: 52000000,
                transport: 16000000,
                tour: 28000000,
                others: 22000000,
                totalOrders: 485,
                avgOrderValue: 319587,
            },
            {
                date: 'Apr 2024',
                foodBeverage: 95000000,
                laundry: 33000000,
                spa: 50000000,
                transport: 15000000,
                tour: 26000000,
                others: 21000000,
                totalOrders: 470,
                avgOrderValue: 317021,
            },
            {
                date: 'May 2024',
                foodBeverage: 102000000,
                laundry: 37000000,
                spa: 55000000,
                transport: 17000000,
                tour: 30000000,
                others: 24000000,
                totalOrders: 495,
                avgOrderValue: 329292,
            },
            {
                date: 'Jun 2024',
                foodBeverage: 115000000,
                laundry: 42000000,
                spa: 62000000,
                transport: 20000000,
                tour: 35000000,
                others: 28000000,
                totalOrders: 550,
                avgOrderValue: 336363,
            },
            {
                date: 'Jul 2024',
                foodBeverage: 125000000,
                laundry: 45000000,
                spa: 68000000,
                transport: 22000000,
                tour: 38000000,
                others: 30000000,
                totalOrders: 580,
                avgOrderValue: 344827,
            },
            {
                date: 'Aug 2024',
                foodBeverage: 120000000,
                laundry: 43000000,
                spa: 65000000,
                transport: 21000000,
                tour: 36000000,
                others: 29000000,
                totalOrders: 565,
                avgOrderValue: 339823,
            },
            {
                date: 'Sep 2024',
                foodBeverage: 108000000,
                laundry: 38000000,
                spa: 58000000,
                transport: 18000000,
                tour: 32000000,
                others: 25000000,
                totalOrders: 515,
                avgOrderValue: 332038,
            },
            {
                date: 'Oct 2024',
                foodBeverage: 105000000,
                laundry: 36000000,
                spa: 56000000,
                transport: 17000000,
                tour: 30000000,
                others: 23000000,
                totalOrders: 500,
                avgOrderValue: 328000,
            },
            {
                date: 'Nov 2024',
                foodBeverage: 100000000,
                laundry: 34000000,
                spa: 53000000,
                transport: 16000000,
                tour: 28000000,
                others: 22000000,
                totalOrders: 485,
                avgOrderValue: 321649,
            },
            {
                date: 'Dec 2024',
                foodBeverage: 130000000,
                laundry: 48000000,
                spa: 70000000,
                transport: 24000000,
                tour: 40000000,
                others: 32000000,
                totalOrders: 600,
                avgOrderValue: 350000,
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
                    <div className="space-y-6">
                        <RevenueSummary data={revenueData} />
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">
                                    Revenue Trends
                                </h3>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-sm border border-[#EBE3D7] rounded hover:bg-[#F5F0EB]">
                                        Line
                                    </button>
                                    <button className="px-3 py-1 text-sm border border-[#EBE3D7] rounded hover:bg-[#F5F0EB]">
                                        Bar
                                    </button>
                                    <button className="px-3 py-1 text-sm bg-[#CCBDA3] text-white rounded">
                                        Area
                                    </button>
                                </div>
                            </div>
                            <RevenueChart data={revenueData} chartType="area" />
                        </div>
                    </div>
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
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <h3 className="text-lg font-semibold mb-4">
                                Membership Growth Over Time
                            </h3>
                            <LoyaltyChart data={loyaltyData} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <MembershipDistribution />
                            <PointsRedemption data={loyaltyData} />
                        </div>
                    </div>
                );

            case 'reviews':
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <h3 className="text-lg font-semibold mb-4">
                                Average Rating Over Time
                            </h3>
                            {reviewTrend && reviewTrend.length > 0 ? (
                                <ReviewChart data={reviewTrend} />
                            ) : (
                                <div className="flex items-center justify-center h-[400px] text-gray-400">
                                    No rating data available
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <RatingBreakdown data={categoryRatings} />
                            <SentimentAnalysis data={sentimentStats} />
                        </div>
                    </div>
                );

            case 'bookings':
                return (
                    <div className="space-y-6">
                        <BookingTrends data={bookingData} />
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <h3 className="text-lg font-semibold mb-4">
                                Bookings by Channel Over Time
                            </h3>
                            <BookingChart data={bookingData} />
                        </div>
                        <ChannelAnalysis />
                    </div>
                );
            case 'services':
                return (
                    <div className="space-y-6">
                        <ServiceSummary data={serviceData} />
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
                            <h3 className="text-lg font-semibold mb-4">
                                Service Revenue Trends
                            </h3>
                            <ServiceChart data={serviceData} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <ServiceDistribution />
                            <PopularServices />
                        </div>
                    </div>
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

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-[#EBE3D7] mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onStartDateChange={setStartDate}
                            onEndDateChange={setEndDate}
                        />
                        <div className="flex gap-4 items-center">
                            <FilterBar
                                period={period}
                                onPeriodChange={setPeriod}
                            />
                            <ExportButton
                                reportType={activeTab}
                                dateRange={{ startDate, endDate }}
                            />
                        </div>
                    </div>
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
