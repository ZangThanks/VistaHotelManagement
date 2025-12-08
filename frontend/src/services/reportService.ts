import { api } from './apiClient';

export interface ServiceReportData {
    date: string;
    foodBeverage: number;
    laundry: number;
    spa: number;
    transport: number;
    tour: number;
    others: number;
    totalOrders: number;
    avgOrderValue: number;
}

export const reportService = {
    /**
     * Lấy báo cáo dịch vụ
     * @param startDate ngày bắt đầu (format: yyyy-MM-dd)
     * @param endDate ngày kết thúc (format: yyyy-MM-dd)
     * @param period loại báo cáo: daily, weekly, monthly, quarterly, yearly
     */
    getServiceReport: async (
        startDate: string,
        endDate: string,
        period: string = 'monthly',
    ): Promise<ServiceReportData[]> => {
        const response = await api.get<ServiceReportData[]>(
            '/reports/services',
            {
                params: {
                    startDate,
                    endDate,
                    period,
                },
            },
        );
        return response.data;
    },
};

