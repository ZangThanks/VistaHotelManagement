import React, { useState, useEffect, useMemo } from "react";
import {
  FaChartLine,
  FaBed,
  FaStar,
  FaUsers,
  FaCalendarCheck,
  FaConciergeBell,
} from "react-icons/fa";
import reportService from "../../../services/reportService";
import {
  exportLoyaltyToPDF,
  exportLoyaltyToExcel,
} from "../../../utils/exportUtils";
import type {
  RevenueData,
  OccupancyData,
  LoyaltyData,
  ReviewData,
  BookingData,
  ReportPeriod,
  ServiceData,
} from "../../../types/Report";
import RevenueSummary from "../../../components/report/RevenueSummary";
import RevenueChart from "../../../components/report/RevenueChart";
import OccupancyChart from "../../../components/report/OccupancyChart";
import RoomTypeAnalysis from "../../../components/report/RoomTypeAnalysis";
import LoyaltyChart from "../../../components/report/LoyaltyChart";
import MembershipDistribution from "../../../components/report/MembershipDistribution";
import LoyaltySummary from "../../../components/report/LoyaltySummary";
// import PointsRedemption from "../../../components/report/PointsRedemption";
import ReviewChart from "../../../components/report/ReviewChart";
import RatingBreakdown from "../../../components/report/RatingBreakdown";
import SentimentAnalysis from "../../../components/report/SentimentAnalysis";
import BookingTrends from "../../../components/report/BookingTrends";
import BookingChart from "../../../components/report/BookingChart";
import DateRangePicker from "../../../components/report/DateRangePicker";
import FilterBar from "../../../components/report/FilterBar";
import ExportButton from "../../../components/report/ExportButton";
import OccupancyStats from "../../../components/report/OccupancyStats";
import ServiceSummary from "../../../components/report/ServiceSummary";
import ServiceChart from "../../../components/report/ServiceChart";
import ServiceDistribution from "../../../components/report/ServiceDistribution";
import PopularServices from "../../../components/report/PopularServices";

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
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  // State for API data
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData[]>([]);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data - Revenue
  const revenueData: RevenueData[] = useMemo(
    () => [
      {
        date: "Jan 2024",
        roomRevenue: 450000000,
        serviceRevenue: 120000000,
        totalRevenue: 570000000,
        bookingCount: 285,
      },
      {
        date: "Feb 2024",
        roomRevenue: 480000000,
        serviceRevenue: 135000000,
        totalRevenue: 615000000,
        bookingCount: 310,
      },
      {
        date: "Mar 2024",
        roomRevenue: 520000000,
        serviceRevenue: 148000000,
        totalRevenue: 668000000,
        bookingCount: 335,
      },
      {
        date: "Apr 2024",
        roomRevenue: 495000000,
        serviceRevenue: 142000000,
        totalRevenue: 637000000,
        bookingCount: 318,
      },
      {
        date: "May 2024",
        roomRevenue: 510000000,
        serviceRevenue: 155000000,
        totalRevenue: 665000000,
        bookingCount: 328,
      },
      {
        date: "Jun 2024",
        roomRevenue: 580000000,
        serviceRevenue: 168000000,
        totalRevenue: 748000000,
        bookingCount: 375,
      },
      {
        date: "Jul 2024",
        roomRevenue: 620000000,
        serviceRevenue: 182000000,
        totalRevenue: 802000000,
        bookingCount: 402,
      },
      {
        date: "Aug 2024",
        roomRevenue: 595000000,
        serviceRevenue: 175000000,
        totalRevenue: 770000000,
        bookingCount: 388,
      },
      {
        date: "Sep 2024",
        roomRevenue: 540000000,
        serviceRevenue: 160000000,
        totalRevenue: 700000000,
        bookingCount: 352,
      },
      {
        date: "Oct 2024",
        roomRevenue: 525000000,
        serviceRevenue: 152000000,
        totalRevenue: 677000000,
        bookingCount: 340,
      },
      {
        date: "Nov 2024",
        roomRevenue: 505000000,
        serviceRevenue: 145000000,
        totalRevenue: 650000000,
        bookingCount: 325,
      },
      {
        date: "Dec 2024",
        roomRevenue: 630000000,
        serviceRevenue: 195000000,
        totalRevenue: 825000000,
        bookingCount: 415,
      },
    ],
    []
  );

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

  // Fetch Loyalty Data from API
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (activeTab !== "loyalty") return;

      setLoading(true);
      setError(null);
      try {
        const data = await reportService.getLoyaltyReport(
          startDate,
          endDate,
          period.toUpperCase()
        );
        setLoyaltyData(data);
      } catch (err) {
        console.error("Failed to fetch loyalty report:", err);
        setError("Failed to load loyalty data. Using sample data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyData();
  }, [activeTab, startDate, endDate, period]);

  // Fetch Booking Data from API
  useEffect(() => {
    const fetchBookingData = async () => {
      if (activeTab !== "bookings") return;

      setLoading(true);
      setError(null);
      try {
        const data = await reportService.getBookingReport(
          startDate,
          endDate,
          period.toUpperCase()
        );
        setBookingData(data);
      } catch (err) {
        console.error("Failed to fetch booking report:", err);
        setError("Failed to load booking data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [activeTab, startDate, endDate, period]);

  // Handle export
  const handleExport = (format: "pdf" | "excel") => {
    const dateRangeText = `${startDate} to ${endDate}`;

    if (activeTab === "loyalty") {
      if (format === "pdf") {
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

  // Service data - now includes all service types
  const serviceData: ServiceData[] = useMemo(
    () => [
      {
        date: "Jan 2024",
        foodBeverage: 85000000,
        laundry: 28000000,
        others: 18000000,
        totalOrders: 420,
        avgOrderValue: 311904,
      },
      {
        date: "Feb 2024",
        foodBeverage: 92000000,
        laundry: 31000000,
        others: 20000000,
        totalOrders: 455,
        avgOrderValue: 314285,
      },
      {
        date: "Mar 2024",
        foodBeverage: 98000000,
        laundry: 35000000,
        others: 22000000,
        totalOrders: 485,
        avgOrderValue: 319587,
      },
      {
        date: "Apr 2024",
        foodBeverage: 95000000,
        laundry: 33000000,
        others: 21000000,
        totalOrders: 470,
        avgOrderValue: 317021,
      },
      {
        date: "May 2024",
        foodBeverage: 102000000,
        laundry: 37000000,
        others: 24000000,
        totalOrders: 495,
        avgOrderValue: 329292,
      },
      {
        date: "Jun 2024",
        foodBeverage: 115000000,
        laundry: 42000000,
        others: 28000000,
        totalOrders: 550,
        avgOrderValue: 336363,
      },
      {
        date: "Jul 2024",
        foodBeverage: 125000000,
        laundry: 45000000,
        others: 30000000,
        totalOrders: 580,
        avgOrderValue: 344827,
      },
      {
        date: "Aug 2024",
        foodBeverage: 120000000,
        laundry: 43000000,
        others: 29000000,
        totalOrders: 565,
        avgOrderValue: 339823,
      },
      {
        date: "Sep 2024",
        foodBeverage: 108000000,
        laundry: 38000000,
        others: 25000000,
        totalOrders: 515,
        avgOrderValue: 332038,
      },
      {
        date: "Oct 2024",
        foodBeverage: 105000000,
        laundry: 36000000,
        others: 23000000,
        totalOrders: 500,
        avgOrderValue: 328000,
      },
      {
        date: "Nov 2024",
        foodBeverage: 100000000,
        laundry: 34000000,
        others: 22000000,
        totalOrders: 485,
        avgOrderValue: 321649,
      },
      {
        date: "Dec 2024",
        foodBeverage: 130000000,
        laundry: 48000000,
        others: 32000000,
        totalOrders: 600,
        avgOrderValue: 350000,
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
          <div className="space-y-6">
            <RevenueSummary data={revenueData} />
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBE3D7]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Revenue Trends</h3>
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
                <p className="text-yellow-700 font-medium">{error}</p>
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
                  <MembershipDistribution data={loyaltyData} />
                </div>
              </>
            )}

            {/* No Data State */}
            {!loading && loyaltyData.length === 0 && !error && (
              <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg text-center">
                <p className="text-gray-600">
                  No loyalty data available for the selected period.
                </p>
              </div>
            )}
          </div>
        );

      case "reviews":
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

      case "bookings":
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
      case "services":
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
              <FilterBar period={period} onPeriodChange={setPeriod} />
              <ExportButton
                reportType={activeTab}
                dateRange={{ startDate, endDate }}
                onExport={handleExport}
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
