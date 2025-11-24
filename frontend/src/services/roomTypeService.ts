import { api } from "./apiClient";
import type { RoomType } from "../types/RoomType";

const ENDPOINT = "/room-types";

/**
 * Get all room types
 */
export const getAllRoomTypes = async (): Promise<RoomType[]> => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching room types:", error);
    throw error;
  }
};

/**
 * Get room type by ID
 */
export const getRoomTypeById = async (id: string): Promise<RoomType> => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching room type by ID:", error);
    throw error;
  }
};

/**
 * Create or update room type
 */
export const saveRoomType = async (
  roomTypeData: Partial<RoomType>
): Promise<RoomType> => {
  try {
    const response = await api.post(`${ENDPOINT}/save`, roomTypeData);
    return response.data;
  } catch (error) {
    console.error("Error saving room type:", error);
    throw error;
  }
};

/**
 * Delete room type
 */
export const deleteRoomType = async (id: string): Promise<void> => {
  try {
    await api.delete(`${ENDPOINT}/delete/${id}`);
  } catch (error) {
    console.error("Error deleting room type:", error);
    throw error;
  }
};

export const roomTypeService = {
  getAllRoomTypes,
  getRoomTypeById,
  saveRoomType,
  deleteRoomType,
};

export default roomTypeService;
