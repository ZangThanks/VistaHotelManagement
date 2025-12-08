import { api } from "./apiClient";

// =======================
// DASHBOARD
// =======================

const ENDPOINT = "/report";

export interface DashboardStats {
    totalRevenue: number;
    revenueChange: number;
    totalBookings: number;
    bookingsChange: number;
    occupancyRate: number;
    occupancyChange: number;
    totalGuests: number;
    guestsChange: number;
    availableRooms: number;
    bookedRooms: number;
    maintenanceRooms: number;
    cleaningRooms: number;
    avgRating: number;
    totalReviews: number;
    pendingCheckIns: number;
    pendingCheckOuts: number;
    revenueData: RevenueData[];
    roomTypeData: RoomTypeData[];
    bookingStatusData: BookingStatusData[];
    dailyOccupancy: DailyOccupancy[];
    popularServices: PopularService[];
}

export interface RevenueData {
    month: string;
    revenue: number;
    bookings: number;
}

export interface RoomTypeData {
    name: string;
    count: number;
}

export interface BookingStatusData {
    status: string;
    count: number;
}

export interface DailyOccupancy {
    day: string;
    rate: number;
}

export interface PopularService {
    name: string;
    orders: number;
    revenue: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    try {
        const response = await api.get(`${ENDPOINT}/dashboard`);
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
};

// =======================
// SERVICE REPORT (DẠNG BIỂU ĐỒ)
/// =======================

export interface ServiceReportData {
    date: string;
    foodBeverage: number;
    laundry: number;
    spa: number;
    transport: number;
    tour: number;
    others: number;
    totalOrders: number;
    avgOrderValue: number;
}

// =======================
// CÁC REPORT KHÁC
// =======================

import type {
    OccupancyData,
    LoyaltyData,
    ReviewData,
    BookingData,
    ServiceData,
} from "../types/Report";

//MERGED SERVICE OBJECT DUY NHẤT
export const reportService = {
    // Revenue Report
    getRevenueReport: async (
        startDate: string,
        endDate: string
    ): Promise<RevenueData[]> => {
        const response = await api.get("/reports/revenue", {
            params: { startDate, endDate },
        });
        return response.data;
    },

    // Occupancy Report
    getOccupancyReport: async (
        startDate: string,
        endDate: string
    ): Promise<OccupancyData[]> => {
        const response = await api.get("/reports/occupancy", {
            params: { startDate, endDate },
        });
        return response.data;
    },

    // Loyalty Report
    getLoyaltyReport: async (
        startDate: string,
        endDate: string,
        period: string = "MONTHLY"
    ): Promise<LoyaltyData[]> => {
        const response = await api.get("/reports/loyalty", {
            params: { startDate, endDate, period },
        });
        return response.data;
    },

    // Review Report
    getReviewReport: async (
        startDate: string,
        endDate: string
    ): Promise<ReviewData[]> => {
        const response = await api.get("/reports/reviews", {
            params: { startDate, endDate },
        });
        return response.data;
    },

    // Booking Report
    getBookingReport: async (
        startDate: string,
        endDate: string,
        period: string = "MONTHLY"
    ): Promise<BookingData[]> => {
        const response = await api.get("/reports/booking", {
            params: { startDate, endDate, period },
        });
        return response.data;
    },

    //SERVICE REPORT CHI TIẾT (TABLE)
    getServiceReportTable: async (
        startDate: string,
        endDate: string
    ): Promise<ServiceData[]> => {
        const response = await api.get("/reports/services", {
            params: { startDate, endDate },
        });
        return response.data;
    },

    //SERVICE REPORT BIỂU ĐỒ
    getServiceReportChart: async (
        startDate: string,
        endDate: string,
        period: string = "monthly"
    ): Promise<ServiceReportData[]> => {
        const response = await api.get("/reports/services/chart", {
            params: { startDate, endDate, period },
        });
        return response.data;
    },
};

//EXPORT DUY NHẤT
export default reportService;
