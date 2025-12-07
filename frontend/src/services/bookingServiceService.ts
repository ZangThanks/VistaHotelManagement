import { api } from './apiClient';
import type { BookingService, OrderStatus } from '../types/BookingService';

const BASE_URL = '/booking-services';

export const bookingServiceService = {
    /**
     * Lấy tất cả đơn đặt dịch vụ
     */
    async getAll(): Promise<BookingService[]> {
        const response = await api.get(BASE_URL);
        return response.data;
    },

    /**
     * Lấy đơn đặt dịch vụ theo booking ID
     */
    async getByBookingId(bookingId: string): Promise<BookingService[]> {
        const response = await api.get(`${BASE_URL}/booking/${bookingId}`);
        return response.data;
    },

    /**
     * Lưu/cập nhật đơn đặt dịch vụ
     */
    async save(bookingService: BookingService): Promise<boolean> {
        const response = await api.post(`${BASE_URL}/save`, bookingService);
        return response.data;
    },

    /**
     * Cập nhật trạng thái đơn hàng
     */
    async updateOrderStatus(
        serviceId: string,
        bookingId: string,
        newStatus: OrderStatus,
    ): Promise<boolean> {
        // Lấy thông tin hiện tại
        const bookingServices = await this.getByBookingId(bookingId);
        const currentService = bookingServices.find(
            (bs) => bs.service.serviceID === serviceId,
        );

        if (!currentService) {
            throw new Error('Booking service not found');
        }

        // Cập nhật trạng thái
        const updatedService = {
            ...currentService,
            orderStatus: newStatus,
        };

        return this.save(updatedService);
    },
};

export default bookingServiceService;
