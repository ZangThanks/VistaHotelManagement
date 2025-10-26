import { axiosInstance } from "../config/api";

const ENDPOINT = "/bookings";

export const getAll = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};

export const createBooking = async (booking) => {
  try {
    const response = await axiosInstance.post(`${ENDPOINT}/save`, booking);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateDepartment = async (id, booking) => {
  try {
    const response = await axiosInstance.put(`${ENDPOINT}/edit/${id}`, booking);
    return response.data;
  } catch (error) {
    console.error(`Error updating booking ${id}:`, error);
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
