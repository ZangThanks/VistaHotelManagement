import { api } from "./apiClient";

const ENDPOINT = "/room";

export const getAllRoom = async () => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

export const getRoomById = async (id: string) => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    throw error;
  }
};
