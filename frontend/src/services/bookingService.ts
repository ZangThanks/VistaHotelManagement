/* eslint-disable */
import { axiosInstance } from "../config/api";
import { api } from "./apiClient";
import type { Booking, RoomBooking } from "../types/Booking";
import type { BookingDetail } from "../types/BookingDetail";

const ENDPOINT = "/bookings";

export const getAll = async (): Promise<Booking[]> => {
  try {
    const response = await axiosInstance.get(ENDPOINT);
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

export const getBookingsByCustomerId = async (
  customerId: string
): Promise<Booking[]> => {
  try {
    const response = await api.get(`${ENDPOINT}/customer/${customerId}`);
    console.log(`📋 Bookings for customer ${customerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for customer ${customerId}:`, error);
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
export const getBookingsByCheckInDate = async (
  date: string
): Promise<Booking[]> => {
  const response = await axiosInstance.get(
    `/bookings/check-in-date?date=${date}`
  );
  return response.data;
};

export const getBookingsByCheckInDateRange = async (
  startDate: string,
  endDate: string
): Promise<Booking[]> => {
  const response = await axiosInstance.get(
    `/bookings/check-in-range?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};
export const getBookingsByCheckOutDate = async (
  date: string
): Promise<Booking[]> => {
  const response = await axiosInstance.get(
    `/bookings/check-out-date?date=${date}`
  );
  return response.data;
};

export const getBookingsByCheckOutDateRange = async (
  startDate: string,
  endDate: string
): Promise<Booking[]> => {
  const response = await axiosInstance.get(
    `/bookings/check-out-range?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

export const processCheckout = async (
  bookingId: string,
  paymentMethod: string
): Promise<any> => {
  const response = await axiosInstance.post(`/bookings/${bookingId}/checkout`, {
    paymentMethod,
  });
  return response.data;
};

/**
 * Get today's checkouts
 */
export const getTodayCheckouts = async (): Promise<Booking[]> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const bookings = await getBookingsByCheckOutDate(today);
    return bookings.filter((b) => b.status === "CHECKED_IN");
  } catch (error) {
    console.error("Error fetching today checkouts:", error);
    return [];
  }
};

/**
 * Get tomorrow's checkouts
 */
export const getTomorrowCheckouts = async (): Promise<Booking[]> => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const bookings = await getBookingsByCheckOutDate(tomorrowStr);
    return bookings.filter((b) => b.status === "CHECKED_IN");
  } catch (error) {
    console.error("Error fetching tomorrow checkouts:", error);
    return [];
  }
};

/**
 * Get late checkouts
 */
export const getLateCheckouts = async (): Promise<Booking[]> => {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 3);

    const startStr = startDate.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];

    const bookings = await getBookingsByCheckOutDateRange(startStr, todayStr);

    const lateBookings = bookings.filter((b) => {
      const checkoutDate = new Date(b.checkOutDate);
      return b.status === "CHECKED_IN" && checkoutDate < today;
    });

    return lateBookings;
  } catch (error) {
    console.error("Error fetching late checkouts:", error);
    return [];
  }
};

/**
 * Get completed checkouts (last 7 days)
 */
export const getCompletedCheckouts = async (): Promise<Booking[]> => {
  try {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const startStr = lastWeek.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];

    const bookings = await getBookingsByCheckOutDateRange(startStr, todayStr);
    return bookings
      .filter((b) => b.status === "CHECKED_OUT")
      .sort((a, b) => {
        return (
          new Date(b.checkOutDate).getTime() -
          new Date(a.checkOutDate).getTime()
        );
      });
  } catch (error) {
    console.error("Error fetching completed checkouts:", error);
    return [];
  }
};

//TODO: ĐỪNG XÓA, pls, OKE EM
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

export const getByRoom = async (roomNumber: string) => {
  const response = await api.get(`/bookings/room/${roomNumber}`);
  return response.data;
};

/**
* Kiểm tra xem một phòng có các đặt phòng trùng lặp trong một khoảng thời gian cụ thể hay không
* @param roomNumber Số phòng cần kiểm tra
* @param checkInDate Ngày/giờ nhận phòng (chuỗi ISO)
* @param checkOutDate Ngày/giờ trả phòng (chuỗi ISO)
* @returns Mảng các đặt phòng trùng lặp
*/
export const checkRoomAvailability = async (
  roomNumber: string,
  checkInDate: string,
  checkOutDate: string
): Promise<Booking[]> => {
  try {
    const response = await api.get(`${ENDPOINT}/check-availability`, {
      params: {
        roomNumber,
        checkInDate,
        checkOutDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking room availability:", error);
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
        const payload: any = {
            cancelReason,
            cancelledBy,
        };

        if (refundMethod) {
            payload.refundMethod = refundMethod;
        }

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

export default {
  getAll,
  getBookingById,
  createBooking,
  updateBooking,
  getAllRoomBookings,
  convertToRoomBooking,
  getByRoom,
  checkRoomAvailability,
  cancelBooking,
};
