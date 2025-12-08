import { api } from "./apiClient";

import type {
  RevenueData,
  OccupancyData,
  LoyaltyData,
  ReviewData,
  BookingData,
  ServiceData,
} from "../types/Report";

export const reportService = {
  // Revenue Report
  getRevenueReport: async (
    startDate: string,
    endDate: string
  ): Promise<RevenueData[]> => {
    try {
      const response = await api.get("/reports/revenue", {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue report:", error);
      throw error;
    }
  },

  // Occupancy Report
  getOccupancyReport: async (
    startDate: string,
    endDate: string
  ): Promise<OccupancyData[]> => {
    try {
      const response = await api.get("/reports/occupancy", {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching occupancy report:", error);
      throw error;
    }
  },

  // Loyalty Report
  getLoyaltyReport: async (
    startDate: string,
    endDate: string,
    period: string = "MONTHLY"
  ): Promise<LoyaltyData[]> => {
    try {
      const response = await api.get("/reports/loyalty", {
        params: { startDate, endDate, period },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching loyalty report:", error);
      throw error;
    }
  },

  // Review Report
  getReviewReport: async (
    startDate: string,
    endDate: string
  ): Promise<ReviewData[]> => {
    try {
      const response = await api.get("/reports/reviews", {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching review report:", error);
      throw error;
    }
  },

  // Booking Report
  getBookingReport: async (
    startDate: string,
    endDate: string,
    period: string = "MONTHLY"
  ): Promise<BookingData[]> => {
    try {
      const response = await api.get("/reports/booking", {
        params: { startDate, endDate, period },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching booking report:", error);
      throw error;
    }
  },

  // Service Report
  getServiceReport: async (
    startDate: string,
    endDate: string
  ): Promise<ServiceData[]> => {
    try {
      const response = await api.get("/reports/services", {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching service report:", error);
      throw error;
    }
  },
};

export default reportService;
