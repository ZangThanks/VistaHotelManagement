/* eslint-disable */
import React, { useState, useMemo, useEffect } from "react";
import {
    FaChartLine,
    FaBed,
    FaStar,
    FaUsers,
    FaCalendarCheck,
    FaConciergeBell,
} from "react-icons/fa";
import type {
    OccupancyData,
    ReviewData,
    ReportPeriod,
    ServiceData,
} from "../../../types/Report";
import OccupancyChart from "../../../components/report/OccupancyChart";
import RoomTypeAnalysis from "../../../components/report/RoomTypeAnalysis";
import ReviewChart from "../../../components/report/ReviewChart";
import RatingBreakdown from "../../../components/report/RatingBreakdown";
import SentimentAnalysis from "../../../components/report/SentimentAnalysis";
import DateRangePicker from "../../../components/report/DateRangePicker";
import FilterBar from "../../../components/report/FilterBar";
import ExportButton from "../../../components/report/ExportButton";
import OccupancyStats from "../../../components/report/OccupancyStats";
import ServiceSummary from "../../../components/report/ServiceSummary";
import ServiceChart from "../../../components/report/ServiceChart";
import ServiceDistribution from "../../../components/report/ServiceDistribution";
import PopularServices from "../../../components/report/PopularServices";
import { reportService } from "../../../services/reportService";
import RevenueTab from "./components/RevenueTab";
import LoyaltyTab from "./components/LoyaltyTab";
import BookingsTab from "./components/BookingsTab";


type ReportTab =
  | "revenue"
  | "occupancy"
  | "loyalty"
  | "reviews"
  | "bookings"
  | "services";

const ReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>("revenue");
  const [period, setPeriod] = useState<ReportPeriod>("monthly");

  // Get current date
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");
  const currentDay = String(today.getDate()).padStart(2, "0");
  const todayStr = `${currentYear}-${currentMonth}-${currentDay}`;

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [serviceData, setServiceData] = useState<ServiceData[]>([]);
  const [isLoadingServiceData, setIsLoadingServiceData] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Auto update date range when period changes
  useEffect(() => {
    if (!showDateFilter) {
      const today = new Date();
      let start = new Date();
      let end = new Date();

      switch (period) {
        case "daily":
          start = today;
          end = today;
          break;
        case "weekly":
          start.setDate(today.getDate() - 6);
          end = today;
          break;
        case "monthly":
          start = new Date(today.getFullYear(), today.getMonth(), 1);
          end = today;
          break;
        case "quarterly":
          const quarter = Math.floor(today.getMonth() / 3);
          start = new Date(today.getFullYear(), quarter * 3, 1);
          end = today;
          break;
        case "yearly":
          start = new Date(today.getFullYear(), 0, 1);
          end = today;
          break;
      }

      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      setStartDate(formatDate(start));
      setEndDate(formatDate(end));
    }
  }, [period, showDateFilter]);

  // Fetch service report data from API
  useEffect(() => {
    if (activeTab === "services") {
      fetchServiceReport();
    }
  }, [activeTab, startDate, endDate, period]);

  const fetchServiceReport = async () => {
    try {
      setIsLoadingServiceData(true);
      const data = await reportService.getServiceReport(
        startDate,
        endDate,
        period
      );
      setServiceData(data);
    } catch (error) {
      console.error("Error fetching service report:", error);
    } finally {
      setIsLoadingServiceData(false);
    }
  };

  // Mock data - Occupancy
  const occupancyData: OccupancyData[] = useMemo(
    () => [
      {
        date: "Jan 2024",
        totalRooms: 105,
        occupiedRooms: 78,
        occupancyRate: 74.3,
      },
      {
        date: "Feb 2024",
        totalRooms: 105,
        occupiedRooms: 82,
        occupancyRate: 78.1,
      },
      {
        date: "Mar 2024",
        totalRooms: 105,
        occupiedRooms: 88,
        occupancyRate: 83.8,
      },
      {
        date: "Apr 2024",
        totalRooms: 105,
        occupiedRooms: 84,
        occupancyRate: 80.0,
      },
      {
        date: "May 2024",
        totalRooms: 105,
        occupiedRooms: 86,
        occupancyRate: 81.9,
      },
      {
        date: "Jun 2024",
        totalRooms: 105,
        occupiedRooms: 95,
        occupancyRate: 90.5,
      },
      {
        date: "Jul 2024",
        totalRooms: 105,
        occupiedRooms: 98,
        occupancyRate: 93.3,
      },
      {
        date: "Aug 2024",
        totalRooms: 105,
        occupiedRooms: 96,
        occupancyRate: 91.4,
      },
      {
        date: "Sep 2024",
        totalRooms: 105,
        occupiedRooms: 89,
        occupancyRate: 84.8,
      },
      {
        date: "Oct 2024",
        totalRooms: 105,
        occupiedRooms: 87,
        occupancyRate: 82.9,
      },
      {
        date: "Nov 2024",
        totalRooms: 105,
        occupiedRooms: 85,
        occupancyRate: 81.0,
      },
      {
        date: "Dec 2024",
        totalRooms: 105,
        occupiedRooms: 100,
        occupancyRate: 95.2,
      },
    ],
    []
  );

  // Mock data - Reviews
  const reviewData: ReviewData[] = useMemo(
    () => [
      {
        date: "Jan 2024",
        averageRating: 4.3,
        totalReviews: 142,
        roomQuality: 4.5,
        service: 4.4,
        location: 4.2,
        value: 4.1,
        sentimentScore: 0.78,
      },
      {
        date: "Feb 2024",
        averageRating: 4.4,
        totalReviews: 158,
        roomQuality: 4.6,
        service: 4.5,
        location: 4.3,
        value: 4.2,
        sentimentScore: 0.82,
      },
      {
        date: "Mar 2024",
        averageRating: 4.5,
        totalReviews: 175,
        roomQuality: 4.7,
        service: 4.6,
        location: 4.4,
        value: 4.3,
        sentimentScore: 0.85,
      },
      {
        date: "Apr 2024",
        averageRating: 4.4,
        totalReviews: 165,
        roomQuality: 4.6,
        service: 4.5,
        location: 4.3,
        value: 4.2,
        sentimentScore: 0.81,
      },
      {
        date: "May 2024",
        averageRating: 4.5,
        totalReviews: 170,
        roomQuality: 4.7,
        service: 4.6,
        location: 4.4,
        value: 4.3,
        sentimentScore: 0.83,
      },
      {
        date: "Jun 2024",
        averageRating: 4.6,
        totalReviews: 188,
        roomQuality: 4.8,
        service: 4.7,
        location: 4.5,
        value: 4.4,
        sentimentScore: 0.87,
      },
    ],
    []
  );

  const tabs = [
    {
      id: "revenue" as ReportTab,
      label: "Revenue Report",
      icon: <FaChartLine />,
      color: "#CCBDA3",
    },
    {
      id: "occupancy" as ReportTab,
      label: "Occupancy Report",
      icon: <FaBed />,
      color: "#2196F3",
    },
    {
      id: "loyalty" as ReportTab,
      label: "Loyalty Report",
      icon: <FaUsers />,
      color: "#FFD700",
    },
    {
      id: "reviews" as ReportTab,
      label: "Review Report",
      icon: <FaStar />,
      color: "#FF9800",
    },
    {
      id: "bookings" as ReportTab,
      label: "Booking Report",
      icon: <FaCalendarCheck />,
      color: "#00C853",
    },
    {
      id: "services" as ReportTab,
      label: "Service Report",
      icon: <FaConciergeBell />,
      color: "#9B59B6",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "revenue":
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

      case "occupancy":
        return (
          <div className="space-y-6">
            <OccupancyStats data={occupancyData} />
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
              <h3 className="text-lg font-semibold mb-4">Occupancy Trends</h3>
              <OccupancyChart data={occupancyData} />
            </div>
            <RoomTypeAnalysis />
          </div>
        );

      case "loyalty":
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
      case "reviews":
        // Calculate average rating breakdown
        const avgRatingBreakdown =
          reviewData.length > 0
            ? {
                location:
                  reviewData.reduce((sum, item) => sum + item.location, 0) /
                  reviewData.length,
                service:
                  reviewData.reduce((sum, item) => sum + item.service, 0) /
                  reviewData.length,
                roomQuality:
                  reviewData.reduce((sum, item) => sum + item.roomQuality, 0) /
                  reviewData.length,
                value:
                  reviewData.reduce((sum, item) => sum + item.value, 0) /
                  reviewData.length,
              }
            : null;

        // Calculate sentiment data based on sentiment scores
        const totalReviews = reviewData.reduce(
          (sum, item) => sum + item.totalReviews,
          0
        );
        const avgSentiment =
          reviewData.length > 0
            ? reviewData.reduce((sum, item) => sum + item.sentimentScore, 0) /
              reviewData.length
            : 0;

        // Convert sentiment score (0-1) to distribution
        const positiveCount = Math.round(totalReviews * avgSentiment);
        const negativeCount = Math.round(
          totalReviews * (1 - avgSentiment) * 0.3
        );
        const neutralCount = totalReviews - positiveCount - negativeCount;

        const sentimentData =
          totalReviews > 0
            ? {
                positive: positiveCount,
                neutral: neutralCount,
                negative: negativeCount,
                positivePercent: (positiveCount / totalReviews) * 100,
                neutralPercent: (neutralCount / totalReviews) * 100,
                negativePercent: (negativeCount / totalReviews) * 100,
              }
            : null;

        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
              <h3 className="text-lg font-semibold mb-4">
                Average Rating Over Time
              </h3>
              <ReviewChart data={reviewData} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RatingBreakdown data={avgRatingBreakdown} />
              <SentimentAnalysis data={sentimentData} />
            </div>
          </div>
        );

      case "bookings":
        return (
          <BookingsTab
            startDate={startDate}
            endDate={endDate}
            period={period}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onPeriodChange={setPeriod}
            activeTab={activeTab}
          />
        );

      case "services":
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
                    onClick={() => setShowDateFilter(!showDateFilter)}
                    className={`px-4 py-2 rounded-md font-medium transition flex items-center gap-2 ${
                      showDateFilter
                        ? "bg-[#B8935F] text-white hover:bg-[#9A7A4D]"
                        : "bg-white text-gray-700 border border-[#EBE3D7] hover:bg-[#F5F0EB]"
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
                  data={activeTab === "services" ? serviceData : undefined}
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
                    <ServiceDistribution data={serviceData} />
                    <PopularServices data={serviceData} />
                  </div>
                </>
              ) : (
                <div className="bg-white p-12 rounded-lg shadow-sm border border-[#EBE3D7] text-center">
                  <p className="text-gray-500">
                    No service data available for the selected period
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
                    ? "border-[#CCBDA3] text-[#CCBDA3]"
                    : "border-transparent text-gray-600 hover:text-[#CCBDA3]"
                }`}
              >
                <span
                  style={{
                    color: activeTab === tab.id ? tab.color : "inherit",
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
