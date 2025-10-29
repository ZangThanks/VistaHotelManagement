import { api } from './apiClient';

export interface Service {
    serviceID: string;
    serviceName: string;
    description: string;
    price: number;
    availability: boolean;
    serviceHours: string;
    serviceCategory:
        | 'LAUNDRY'
        | 'FOOD_BEVERAGE'
        | 'SPA'
        | 'TRANSPORT'
        | 'TOUR'
        | 'OTHER';
}

// Lấy tất cả dịch vụ
export const getAllServices = async (): Promise<Service[]> => {
    const response = await api.get('/services');
    return response.data;
};

// Thêm hoặc cập nhật dịch vụ
export const saveService = async (service: Service): Promise<Service> => {
    const response = await api.post('/services', service);
    return response.data;
};

// Tìm kiếm dịch vụ theo tên
export const searchServices = async (name: string): Promise<Service[]> => {
    const response = await api.get(`/services/search?name=${name}`);
    return response.data;
};
