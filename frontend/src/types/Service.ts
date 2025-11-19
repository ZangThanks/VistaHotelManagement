export type ServiceCategory =
  | "FOOD_BEVERAGE"
  | "WELLNESS"
  | "TRANSPORTATION"
  | "RECREATION"
  | "LAUNDRY"
  | string;

export interface Service {
  serviceID: string;
  serviceName: string;
  description: string;
  price: number;
  availability: boolean;
  serviceHours?: string | null;
  serviceCategory: ServiceCategory;
}
