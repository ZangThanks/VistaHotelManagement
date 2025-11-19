import { api } from "./apiClient";

const ENDPOINT = "/news";

export const getAll = async () => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
export const getHighlighted = async () => {
  try {
    const response = await api.get(`${ENDPOINT}/highlight`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching highlighted news:", error);
    throw error;
  }
};
export const getNewsById = async (id: string) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data;
};
