export type OrderStatus =
    | 'PLACE'
    | 'PREPARING'
    | 'READY'
    | 'DELIVERED'
    | 'CANCELLED';

export type PaymentMethod =
    | 'CASH'
    | 'CREDIT_CARD'
    | 'BANK_TRANSFER'
    | 'E_WALLET';

export interface BookingService {
    service: {
        serviceID: string;
        serviceName: string;
        description: string;
        price: number;
        serviceCategory: string;
        availability: boolean;
        serviceHours?: string | null;
    };
    booking: {
        bookingID: string;
        checkInDate: string;
        checkOutDate: string;
        status: string;
        customer?: {
            customerID: string;
            fullName: string;
            phone: string;
            email: string;
        };
    };
    servicePrice: number;
    quantity: number;
    totalAmount: number;
    orderStatus: OrderStatus;
    paymentMethod: PaymentMethod;
}
