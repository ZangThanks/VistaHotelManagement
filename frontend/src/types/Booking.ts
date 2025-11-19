import type { Customer } from "./Customer";
import type { Employee } from "./Employee";

export type BookingStatus =
  | "PENDING"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED"
  | string;
export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED"
  | string;
export type InvoiceType =
  | "ROOM_BOOKING"
  | "SERVICE"
  | "ADDITIONAL_FEE"
  | "REFUND"
  | string;

export interface Booking {
  bookingID: string;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  numberOfGuests: number;
  status: BookingStatus;
  specialRequests?: string | null;
  bookingDate: string;
  cancellationDate?: string | null;
  hourlyRate?: number | null;
  duration: number;
  packageType?: string | null;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  invoiceType: InvoiceType;
  totalCost?: number | null;
  customer?: Customer | null;
  employee?: Employee | null;
}
