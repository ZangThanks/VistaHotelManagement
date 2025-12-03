import { api } from './apiClient';

const ENDPOINT = '/room-change-requests';

export interface RoomChangeRequestDTO {
    bookingId: string;
    currentRoomNumber: string;
    newRoomNumber: string;
    reason: string;
}

export interface RoomChangeResponseDTO {
    approve: boolean;
    responseNote: string;
    processedBy: string;
}

export interface RoomChangeRequestResponse {
    requestID: string;
    booking: any;
    currentRoom: any;
    newRoom: any;
    reason: string;
    requestDate: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    responseNote?: string;
    responseDate?: string;
    processedBy?: string;
}

// Get all requests
export const getAllRequests = async (): Promise<
    RoomChangeRequestResponse[]
> => {
    try {
        const response = await api.get(ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching room change requests:', error);
        throw error;
    }
};

// Get request by ID
export const getRequestById = async (
    id: string,
): Promise<RoomChangeRequestResponse> => {
    try {
        const response = await api.get(`${ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching request ${id}:`, error);
        throw error;
    }
};

// Get requests by booking ID
export const getRequestsByBookingId = async (
    bookingId: string,
): Promise<RoomChangeRequestResponse[]> => {
    try {
        const response = await api.get(`${ENDPOINT}/booking/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching requests for booking ${bookingId}:`,
            error,
        );
        throw error;
    }
};

// Get requests by customer ID
export const getRequestsByCustomerId = async (
    customerId: string,
): Promise<RoomChangeRequestResponse[]> => {
    try {
        const response = await api.get(`${ENDPOINT}/customer/${customerId}`);
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching requests for customer ${customerId}:`,
            error,
        );
        throw error;
    }
};

// Get pending requests
export const getPendingRequests = async (): Promise<
    RoomChangeRequestResponse[]
> => {
    try {
        const response = await api.get(`${ENDPOINT}/pending`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        throw error;
    }
};

// Create new request
export const createRequest = async (
    dto: RoomChangeRequestDTO,
): Promise<RoomChangeRequestResponse> => {
    try {
        const response = await api.post(ENDPOINT, dto);
        return response.data;
    } catch (error) {
        console.error('Error creating room change request:', error);
        throw error;
    }
};

// Process request (approve or reject)
export const processRequest = async (
    requestId: string,
    response: RoomChangeResponseDTO,
): Promise<RoomChangeRequestResponse> => {
    try {
        const res = await api.put(`${ENDPOINT}/${requestId}/process`, response);
        return res.data;
    } catch (error) {
        console.error(`Error processing request ${requestId}:`, error);
        throw error;
    }
};

// Delete request
export const deleteRequest = async (requestId: string): Promise<void> => {
    try {
        await api.delete(`${ENDPOINT}/${requestId}`);
    } catch (error) {
        console.error(`Error deleting request ${requestId}:`, error);
        throw error;
    }
};

export default {
    getAllRequests,
    getRequestById,
    getRequestsByBookingId,
    getRequestsByCustomerId,
    getPendingRequests,
    createRequest,
    processRequest,
    deleteRequest,
};
