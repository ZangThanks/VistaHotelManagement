import { axiosInstance } from "../config/api";

const ENDPOINT = "/news";

export const getAll = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
export const getHighlighted = async () => {
  try {
    const response = await axiosInstance.get(`${ENDPOINT}/highlight`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching highlighted news:", error);
    throw error;
  }
};
export const getNewsById = async (id: string) => {
  const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
  return response.data;
};
