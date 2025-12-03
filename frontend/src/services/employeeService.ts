/* eslint-disable */
import { axiosInstance } from '../config/api';
// import type { Employee } from '../types/Employee';
const ENDPOINT = '/employees';

export const getAll = async () => {
    try {
        const response = await axiosInstance.get(ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};