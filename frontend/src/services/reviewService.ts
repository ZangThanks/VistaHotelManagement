import type { Review } from "../types/Review";
import { api } from "./apiClient";

const ENDPOINT = "/reviews";

export const getReviewsByRoomNumber = async (id: string) => {
  try {
    const response = await api.get(`${ENDPOINT}/room/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    throw error;
  }
};

export const saveReview = async (
  review: Review,
  bookingId: string,
  roomNumber: string
) => {
  try {
    const response = await api.post(
      `${ENDPOINT}/save/${bookingId}/${roomNumber}`,
      review
    );
    return response.data;
  } catch (error) {
    console.error("Error saving review:", error);
    throw error;
  }
};

export const getReviewsWithCustomerByRoomNumber = async (
  roomNumber: string
) => {
  try {
    const response = await api.get(
      `${ENDPOINT}/room/with-customer/${roomNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Error get review:", error);
    throw error;
  }
};

export const getBookingByReviewId = async (reviewID: string) => {
  try {
    const res = await api.get(`${ENDPOINT}/booking/${reviewID}`);
    return res.data;
  } catch (err) {
    console.log("Error get booking by review ID:", err);
    throw err;
  }
};
