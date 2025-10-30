import type { Room } from "./Room";
import type { Customer } from "./Customer";

export type BookingStatus =
  | "PENDING"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";
export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";
export type InvoiceType =
  | "ROOM_BOOKING"
  | "SERVICE"
  | "ADDITIONAL_FEE"
  | "REFUND";

export interface BookingDetail {
  room: Room;
  roomPrice: number;
}

export interface Booking {
  bookingID: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: BookingStatus;
  specialRequests?: string;
  bookingDate: string;
  cancellationDate?: string;
  hourlyRate?: number;
  duration?: number;
  packageType?: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  invoiceType: InvoiceType;
  totalCost: number;
  customer: Customer;
  employee?: {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
  };
  bookingDetails: BookingDetail[];
}

export interface RoomBooking {
  id: string;
  roomId: string;
  roomNumber: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: "pending" | "checked-in" | "checked-out" | "cancelled";
  numberOfGuests: number;
  totalAmount: number;
}
