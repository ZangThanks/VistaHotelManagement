import { api } from "./apiClient";
import type { Booking, RoomBooking } from "../types/Booking";

const ENDPOINT = "/bookings";

export const getAll = async (): Promise<Booking[]> => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
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

export const createBooking = async (booking: object): Promise<Booking> => {
  try {
    const response = await api.post(`${ENDPOINT}/save`, booking);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking = async (
  id: string,
  booking: object
): Promise<Booking> => {
  try {
    const response = await api.put(`${ENDPOINT}/edit/${id}`, booking);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    throw error;
  }
};

/**
 * Convert API Booking to UI RoomBooking format for calendar view
 */
export const convertToRoomBooking = (booking: Booking): RoomBooking[] => {
  // Mỗi booking có thể có nhiều phòng trong bookingDetails
  return booking.bookingDetails.map((detail) => ({
    id: booking.bookingID,
    roomId: detail.room.roomNumber || "",
    roomNumber: detail.room.roomNumber || "",
    guestName: booking.customer.fullName,
    checkIn: new Date(booking.checkInDate),
    checkOut: new Date(booking.checkOutDate),
    status:
      booking.status === "CHECKED_IN"
        ? "checked-in"
        : booking.status === "CHECKED_OUT"
        ? "checked-out"
        : booking.status === "PENDING"
        ? "pending"
        : booking.status === "CANCELLED"
        ? "cancelled"
        : "pending" as const,
    numberOfGuests: booking.numberOfGuests,
    totalAmount: booking.totalAmount,
  }));
};

/**
 * Get all bookings and convert to RoomBooking format
 */
export const getAllRoomBookings = async (): Promise<RoomBooking[]> => {
  try {
    const bookings = await getAll();
    const roomBookings: RoomBooking[] = [];

    bookings.forEach((booking) => {
      roomBookings.push(...convertToRoomBooking(booking));
    });

    return roomBookings;
  } catch (error) {
    console.error("Error fetching room bookings:", error);
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
};
