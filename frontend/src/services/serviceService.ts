import { api } from "./apiClient";

const ENDPOINT = "/services";

export const getAll = async () => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};
