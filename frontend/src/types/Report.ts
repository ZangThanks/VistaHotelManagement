export interface RevenueData {
    date: string;
    roomRevenue: number;
    serviceRevenue: number;
    totalRevenue: number;
    bookingCount: number;
}

export interface OccupancyData {
    date: string;
    totalRooms: number;
    occupiedRooms: number;
    occupancyRate: number;
    roomType?: string;
}

export interface LoyaltyData {
    month: string;
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    totalPoints: number;
    redemptions: number;
}

export interface ReviewData {
    date: string;
    averageRating: number;
    totalReviews: number;
    roomQuality: number;
    service: number;
    location: number;
    value: number;
    sentimentScore: number;
}

export interface BookingData {
    date: string;
    website: number;
    phone: number;
    walkin: number;
    totalBookings: number;
    cancellationRate: number;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}
export interface ServiceData {
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

export type ReportPeriod =
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'quarterly'
    | 'yearly';
