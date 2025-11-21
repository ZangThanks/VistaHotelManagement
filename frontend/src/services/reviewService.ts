import { api } from './apiClient';

const ENDPOINT = '/reviews';

export const getReviewsByRoomNumber = async (id: string) => {
    try {
        const response = await api.get(`${ENDPOINT}/room/${id}`);
        console.log('=========RESPONSE DATA: ' + response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching room by ID:', error);
        throw error;
    }
};
