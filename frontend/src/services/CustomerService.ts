import { axiosInstance } from "../config/api";

const ENDPOINT = "/customers";

export const getAll = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};
