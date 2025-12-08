import { api } from "./apiClient";

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

export default {
  getDashboardStats,
};
