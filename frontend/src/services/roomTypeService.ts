import type { RoomType } from '../types/RoomType';
import { api } from './apiClient';

const ENDPOINT = '/room-types';

export const getAllRoomTypes = async () => {
    try {
        const response = await api.get(ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching room types:', error);
        throw error;
    }
};

// Get single room type by id
export const getRoomTypeById = async (id: string) => {
    try {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching room type ${id}:`, error);
        throw error;
    }
};

export async function saveRoomType(roomType: RoomType) {
    try {
        const res = await api.post(`${ENDPOINT}/save`, roomType);
        return res.data;
    } catch (err) {
        console.error('Error saving room type:', err);
        throw err;
    }
}
