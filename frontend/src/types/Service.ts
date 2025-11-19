export type ServiceCategory = 'FOOD BEVERAGE' | 'LAUNDRY' | string;

export interface Service {
    serviceID: string;
    serviceName: string;
    description: string;
    price: number;
    serviceCategory: ServiceCategory;
    available: boolean;
    images: string[] | null;
    bookingServices: string[] | null;
}
