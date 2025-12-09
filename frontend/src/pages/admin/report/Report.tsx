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
    ReviewData,
    ReportPeriod,
    ServiceData,
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

    /* -------------------------------------------------- */
    /* ---------------- Mock Occupancy Data ------------- */
    /* -------------------------------------------------- */
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

    /* -------------------------------------------------- */
    /* ---------------- Mock Review Data ---------------- */
    /* -------------------------------------------------- */
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
                        {/* Filter Bar for Occupancy */}
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

                        <ReviewChart data={reviewData} />
                        <RatingBreakdown data={reviewData} />
                        <SentimentAnalysis data={reviewData} />
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
