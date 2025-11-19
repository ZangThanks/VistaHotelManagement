import { api } from './apiClient';

const ENDPOINT = '/rooms';

export const getAllRoom = async () => {
    try {
        const response = await api.get(ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};

export const getById = async (id: string) => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`)
    console.log("=========RESPONSE DATA: " + response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching room by ID:', error);
    throw error;
  }
}


