import { axiosInstance } from "../config/api";

const ENDPOINT = "/services";

export const getAll = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
