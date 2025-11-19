import { axiosInstance } from "../config/api";
import { api } from "./apiClient";

const ENDPOINT = "/bookings";

export const getAll = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINT);
    console.log("=========DATAAAA: " + response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

export const getBookingById = async (id: string) => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};

export const createBooking = async (booking: object) => {
  try {
    const response = await api.post(`${ENDPOINT}/save`, booking);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking = async (id: string, booking: object) => {
  try {
    const response = await api.put(`${ENDPOINT}/edit/${id}`, booking);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
    throw error;
  }
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

// export const deleteBooking = async (id) => {
//   try {
//     await axios.delete(`${API_URL}/${id}`);
//     return true;
//   } catch (error) {
//     console.error(`Error deleting booking ${id}:`, error);
//     throw error;
//   }
// };
