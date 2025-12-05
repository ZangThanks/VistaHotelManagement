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
