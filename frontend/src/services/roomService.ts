import { api } from "./apiClient";

export type RoomStatus =
  | "AVAILABLE"
  | "BOOKED"
  | "CLEANING"
  | "MAINTENANCE";

export interface RoomType {
    roomTypeID: string;
    typeName: string;
    description: string;
    area: number;
    maxOccupancy: number;
    amenties: string[];
    basePrice: number;
    images: string[];
}

export interface Room {
    roomNumber: string;
    floor: number;
    status: RoomStatus;
    lastCleaned: string; // ISO date string
    notes: string;
    roomType: RoomType;
}

interface ApiResponse<T> {
    success?: boolean;
    data?: T;
    message?: string;
}


export const roomService = {
  /**
   * Get all rooms
   */
  async getAllRooms(): Promise<Room[]> {
    try {
      const response = await api.get<Room[]>("/room");
      return response.data;
    } catch (error) {
      console.error("Error fetching rooms: ", error);
      throw error;
    }
  },

  /**
   * Get room by ID
   */
  async getRoomById(id: string): Promise<Room | null> {
    try {
      const response = await api.get<Room>(`/room/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room with id ${id}: `, error);
      return null;
    }
  },

  /**
   * Create or update room
   */
  async saveRoom(room: Partial<Room>): Promise<Room> {
    try {
      const response = await api.post<Room>("/room/save", room);
      return response.data;
    } catch (error) {
      console.error("Error saving room:", error);
      throw error;
    }
  },

  /**
   * Delete room by ID
   */
  async deleteRoom(id: string): Promise<void> {
    try {
      await api.delete(`/room/delete/${id}`);
    } catch (error) {
      console.error(`Error deleting room ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all room types
   */
  async getAllRoomTypes(): Promise<RoomType[]> {
    try {
      const response = await api.get<RoomType[]>("/room-type");
      return response.data;
    } catch (error) {
      console.error("Error fetching room types:", error);
      throw error;
    }
  },

  /**
   * Get room type by ID
   */
  async getRoomTypeById(id: string): Promise<RoomType | null> {
    try {
      const response = await api.get<RoomType>(`/room-type/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching room type ${id}:`, error);
      return null;
    }
  },

  /**
   * Create or update room type
   */
  async saveRoomType(roomType: Partial<RoomType>): Promise<RoomType> {
    try {
      const response = await api.post<RoomType>("/room-type/save", roomType);
      return response.data;
    } catch (error) {
      console.error("Error saving room type:", error);
      throw error;
    }
  },

  /**
   * Delete room type by ID
   */
  async deleteRoomType(id: string): Promise<void> {
    try {
      await api.delete(`/room-type/delete/${id}`);
    } catch (error) {
      console.error(`Error deleting room type ${id}:`, error);
      throw error;
    }
  },
};

export default roomService;