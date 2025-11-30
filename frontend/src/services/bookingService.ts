import { axiosInstance } from "../config/api";
import { api } from "./apiClient";
import type { Booking, RoomBooking } from "../types/Booking";
import type { BookingDetail } from "../types/BookingDetail";

const ENDPOINT = "/bookings";

export const getAll = async (): Promise<Booking[]> => {
  try {
    const response = await axiosInstance.get(ENDPOINT);
    console.log("=========DATAAAA: " + response.data);
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

export const getBookingDetailsById = async (
  id: string
): Promise<BookingDetail[]> => {
  try {
    const response = await api.get(`${ENDPOINT}/details/${id}`);
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
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const saveBookingWithDetails = async (
  booking: object,
  bookingDetails: object[],
  bookingServices: object[]
): Promise<boolean> => {
  try {
    const response = await api.post(`${ENDPOINT}/save-booking`, {
      booking,
      bookingDetails,
      bookingServices,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving booking with details:", error);
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

export const cancelBookingPayment = async (
  bookingId: string
): Promise<Booking> => {
  try {
    const response = await api.put(`${ENDPOINT}/cancel-payment/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking payment ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Convert API Booking to UI RoomBooking format for calendar view
 */
export const convertToRoomBooking = (booking: Booking): RoomBooking[] => {
  console.log("Converting booking:", booking);
  // Mỗi booking có thể có nhiều phòng trong bookingDetails
  return booking.bookingDetails.map((detail) => ({
    id: booking.bookingID,
    roomId: String(detail.room.roomNumber ?? ""),
    roomNumber: String(detail.room.roomNumber ?? ""),
    guestName: booking.customer?.fullName ?? "",
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
        : ("pending" as const),
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
  }
  return [];
};

export const searchBookings = async (keyword: string) => {
  try {
    const response = await axiosInstance.get(`${ENDPOINT}/search`, {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching bookings with keyword "${keyword}":`, error);
    throw error;
  }
};

export const generateBookingID = async () => {
  try {
    const response = await api.get(`${ENDPOINT}/create-booking-id`);
    return response.data;
  } catch (error) {
    console.error("Error generating booking ID:", error);
    throw error;
  }
};

export const simulatePaymentCallback = async (
  body: unknown
): Promise<unknown> => {
  try {
    const res = await axiosInstance.post(`${ENDPOINT}/pay-callback`, body);
    return res.data;
  } catch (error) {
    console.error("Error generating booking ID:", error);
    throw error;
  }
};

export const generateQRPayment = async (
  bookingId: string,
  choice: number = 0
) => {
  try {
    const response = await api.get(`${ENDPOINT}/payment-qr/${bookingId}`, {
      params: { choice },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error generating QR payment:", error);
    throw error;
  }
};

export const overlapBookingExists = async (roomNumber: string) => {
  try {
    const res = await api.get(`${ENDPOINT}/overlapping-bookings/${roomNumber}`);
    return res.data;
  } catch (error) {
    console.error("Error checking overlap booking:", error);
    throw error;
  }
};

// export const deleteBooking = async (id) => {
//   try {
//     await axios.delete(`${API_URL}/${id}`);
//     return true;
//   } catch (error) {
//     console.error(`Error deleting booking ${id}:`, error);
//     throw error;
//   }
// };
export const checkIn = async (bookingId: string): Promise<Booking> => {
  try {
    const response = await axiosInstance.put(
      `${ENDPOINT}/${bookingId}/check-in`
    );
    return response.data;
  } catch (error) {
    console.error("Check-in error:", error);
    throw error;
  }
};

//TODO: ĐỪNG XÓA, pls
// export const checkOut = async (bookingId: string): Promise<Booking> => {
//   try {
//     const response = await axiosInstance.put(
//       `${ENDPOINT}/${bookingId}/check-out`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Check-out error:", error);
//     throw error;
//   }
// };
// export const approveEarlyCheckin = async (
//   bookingId: string,
//   approve: boolean
// ): Promise<Booking> => {
//   try {
//     const response = await axiosInstance.put(
//       `${ENDPOINT}/${bookingId}/early-checkin/approve`,
//       null,
//       {
//         params: { approve },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Approve early check-in error:", error);
//     throw error;
//   }
// };
export default {
  getAll,
  getBookingById,
  getBookingDetailsById,
  createBooking,
  updateBooking,
  getAllRoomBookings,
  convertToRoomBooking,
};
