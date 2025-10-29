import { api } from "./apiClient";

const ENDPOINT = "/bookings";

export const getAll = async () => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};

export const createBooking = async (booking) => {
  try {
    const response = await api.post(`${ENDPOINT}/save`, booking);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking = async (id, booking) => {
  try {
    const response = await api.put(`${ENDPOINT}/edit/${id}`, booking);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    throw error;
  }
};
