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
