/* eslint-disable */
import { axiosInstance } from '../config/api';
import { api } from './apiClient';
import type { Booking, RoomBooking } from '../types/Booking';
import type { BookingDetail } from '../types/BookingDetail';

const ENDPOINT = '/bookings';

export const getAll = async (): Promise<Booking[]> => {
    try {
        const response = await axiosInstance.get(ENDPOINT);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching booking:', error);
        return [];
    }
};

export const getBookingById = async (id: string): Promise<Booking> => {
    try {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching booking ${id}:`, error);
        throw error;
    }
};

export const getBookingDetailsById = async (
    id: string,
): Promise<BookingDetail[]> => {
    try {
        const response = await api.get(`/booking-details/booking/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching booking details ${id}:`, error);
        throw error;
    }
};

export const createBooking = async (booking: object): Promise<Booking> => {
    try {
        const response = await api.post(`${ENDPOINT}/save`, booking);
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const saveBookingWithDetails = async (
    booking: object,
    bookingDetails: object[],
    bookingServices: object[],
): Promise<boolean> => {
    try {
        const response = await api.post(`${ENDPOINT}/save-booking`, {
            booking,
            bookingDetails,
            bookingServices,
        });
        return response.data;
    } catch (error) {
        console.error('Error saving booking with details:', error);
        throw error;
    }
};

export const updateBooking = async (
    id: string,
    booking: object,
): Promise<Booking> => {
    try {
        const response = await api.put(`${ENDPOINT}/edit`, booking);
        return response.data;
    } catch (error) {
        console.error(`Error updating booking ${id}:`, error);
        throw error;
    }
};

export const getBookingsByCustomerId = async (
    customerId: string,
): Promise<Booking[]> => {
    try {
        const response = await api.get(`${ENDPOINT}/customer/${customerId}`);
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching bookings for customer ${customerId}:`,
            error,
        );
        throw error;
    }
};

export const cancelBookingPayment = async (
    bookingId: string,
): Promise<Booking> => {
    try {
        const response = await api.put(
            `${ENDPOINT}/cancel-payment/${bookingId}`,
        );
        return response.data;
    } catch (error) {
        console.error(`Error cancelling booking payment ${bookingId}:`, error);
        throw error;
    }
};

export const convertToRoomBooking = (booking: Booking): RoomBooking[] => {
    return booking.bookingDetails.map((detail) => ({
        id: booking.bookingID,
        roomId: String(detail.room.roomNumber ?? ''),
        roomNumber: String(detail.room.roomNumber ?? ''),
        guestName: booking.customer?.fullName ?? '',
        checkIn: new Date(booking.checkInDate),
        checkOut: new Date(booking.checkOutDate),
        status:
            booking.status === 'CHECKED_IN'
                ? 'checked-in'
                : booking.status === 'CHECKED_OUT'
                ? 'checked-out'
                : booking.status === 'PENDING'
                ? 'pending'
                : booking.status === 'CANCELLED'
                ? 'cancelled'
                : 'pending',
        numberOfGuests: booking.numberOfGuests,
        totalAmount: booking.totalAmount,
    }));
};

export const getAllRoomBookings = async (): Promise<RoomBooking[]> => {
    try {
        const bookings = await getAll();
        const roomBookings: RoomBooking[] = [];
        if (Array.isArray(bookings)) {
            bookings.forEach((booking) => {
                roomBookings.push(...convertToRoomBooking(booking));
            });
        }
        return roomBookings;
    } catch (error) {
        console.error('Error fetching room bookings:', error);
        return [];
    }
};

// ================= DATE FILTER FUNCTIONS =================

export const getBookingsByCheckInDate = async (
    date: string,
): Promise<Booking[]> => {
    const response = await axiosInstance.get(
        `/bookings/check-in-date?date=${date}`,
    );
    return response.data;
};

export const getBookingsByCheckInDateRange = async (
    startDate: string,
    endDate: string,
): Promise<Booking[]> => {
    const response = await axiosInstance.get(
        `/bookings/check-in-range?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.data;
};

export const getBookingsByCheckOutDate = async (
    date: string,
): Promise<Booking[]> => {
    const response = await axiosInstance.get(
        `/bookings/check-out-date?date=${date}`,
    );
    return response.data;
};

export const getBookingsByCheckOutDateRange = async (
    startDate: string,
    endDate: string,
): Promise<Booking[]> => {
    const response = await axiosInstance.get(
        `/bookings/check-out-range?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.data;
};

export const getByRoom = async (roomNumber: string): Promise<Booking[]> => {
    try {
        const response = await api.get(`${ENDPOINT}/room/${roomNumber}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error(`Error fetching bookings for room ${roomNumber}:`, error);
        throw error;
    }
};

export const generateBookingID = async (): Promise<string> => {
    try {
        const response = await api.get(`${ENDPOINT}/create-booking-id`);
        return response.data;
    } catch (error) {
        console.error('Error generating booking ID:', error);
        throw error;
    }
};

export const overlapBookingExists = async (roomId: string): Promise<any[]> => {
    try {
        const response = await api.get(
            `${ENDPOINT}/overlapping-bookings/${roomId}`,
        );
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error(
            `Error checking overlap bookings for room ${roomId}:`,
            error,
        );
        throw error;
    }
};

export const checkIn = async (bookingId: string): Promise<Booking> => {
    try {
        const response = await axiosInstance.put(
            `${ENDPOINT}/${bookingId}/check-in`,
        );
        return response.data;
    } catch (error) {
        console.error('Check-in error:', error);
        throw error;
    }
};

// ========== ADD SERVICES TO BOOKING ==========
export type BookingServiceCreateItem = {
    serviceID: string;
    quantity: number;
};

export const addServicesToBooking = async (
    bookingId: string,
    items: BookingServiceCreateItem[],
) => {
    const res = await api.post(`${ENDPOINT}/${bookingId}/services/bulk`, items);
    return res.data;
};

export const addServiceToBooking = async (
    bookingId: string,
    item: BookingServiceCreateItem,
) => {
    const res = await api.post(`${ENDPOINT}/${bookingId}/services`, item);
    return res.data;
};

// =============================================
export const checkRoomAvailability = async (
    roomNumber: string,
    checkInDate: string,
    checkOutDate: string,
): Promise<Booking[]> => {
    try {
        const response = await api.get(`${ENDPOINT}/check-availability`, {
            params: { roomNumber, checkInDate, checkOutDate },
        });
        return response.data;
    } catch (error) {
        console.error('Error checking room availability:', error);
        throw error;
    }
};

export const cancelBooking = async (
    bookingId: string,
    cancelReason: string,
    cancelledBy: string,
    refundMethod: any | null,
) => {
    try {
        const payload: any = { cancelReason, cancelledBy };
        if (refundMethod) payload.refundMethod = refundMethod;
        console.log('=== BOOKING SERVICE DEBUG ===');
        console.log(
            'Cancel booking payload:',
            JSON.stringify(payload, null, 2),
        );
        console.log('API endpoint:', `${ENDPOINT}/${bookingId}/cancel`);
        const response = await api.post(
            `${ENDPOINT}/${bookingId}/cancel`,
            payload,
        );
        return response.data;
    } catch (error) {
        console.error(`Error cancelling booking ${bookingId}:`, error);
        throw error;
    }
};

export const getBookingServicesByBookingId = async (bookingId: string) => {
    try {
        const response = await api.get(
            `${ENDPOINT}/booking-services/booking/${bookingId}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching booking services:', error);
        throw error;
    }
};

export const confirmPayAtCheckout = async (
    bookingId: string,
): Promise<Booking> => {
    try {
        const response = await api.put(
            `${ENDPOINT}/${bookingId}/confirm-pay-at-checkout`,
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error confirming pay at checkout for booking ${bookingId}:`,
            error,
        );
        throw error;
    }
};

export const generateQRPayment = async (
    bookingId: string,
    paymentMethod: string,
): Promise<Blob> => {
    try {
        const response = await axiosInstance.get(
            `${ENDPOINT}/payment-qr/${bookingId}`,
            {
                params: { method: paymentMethod },
                responseType: 'blob',
            },
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error generating QR payment for booking ${bookingId}:`,
            error,
        );
        throw error;
    }
};

export const searchBookings = async (keyword: string): Promise<Booking[]> => {
    try {
        const response = await api.get(`${ENDPOINT}/search`, {
            params: { keyword },
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error(
            `Error searching bookings with keyword ${keyword}:`,
            error,
        );
        throw error;
    }
};

export const processCheckout = async (
    bookingId: string,
    paymentMethod: string,
): Promise<any> => {
    try {
        const response = await api.post(`${ENDPOINT}/${bookingId}/checkout`, {
            paymentMethod,
        });
        return response.data;
    } catch (error) {
        console.error(
            `Error processing checkout for booking ${bookingId}:`,
            error,
        );
        throw error;
    }
};

export default {
    getAll,
    getBookingById,
    createBooking,
    updateBooking,
    getAllRoomBookings,
    convertToRoomBooking,
    getByRoom,
    addServicesToBooking,
    addServiceToBooking,
    checkRoomAvailability,
    cancelBooking,
};
