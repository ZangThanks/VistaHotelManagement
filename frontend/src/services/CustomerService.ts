import axios from 'axios';

const API_URL = 'http://localhost:8080/customers';

export const getAll = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};
