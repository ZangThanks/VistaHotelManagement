export interface Booking {
  bookingID: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
  specialRequests?: string;
  bookingDate: string;
  cancellationDate?: string;
  hourlyRate?: number | null;
  duration: number;
  packageType: string;
  totalAmount: number;
  paymentStatus:
    | "PENDING"
    | "COMPLETED"
    | "PERCENTAGE_30"
    | "PERCENTAGE_50"
    | "PAID"
    | "REFUNDED"
    | "CANCELLED";
  invoiceType?: string | null;
  totalCost: number;
  type: "HOURLY" | "DAILY";
  customer: Customer;
  employee?: Employee;
  bookingDetails: BookingDetail[];
  earlyCheckin?: EarlyCheckin | null;
}

export interface EarlyCheckin {
  id?: string;
  requestTime: string;
  earlyCheckInTime: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  additionalFee: number;
  notes?: string;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  roomNumber: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled";
  numberOfGuests: number;
  totalAmount: number;
  specialRequests?: string;
  paymentStatus?: string;
  customer?: any;
  bookingDetails?: any[];
  earlyCheckin?: EarlyCheckin | null;
}

import type { Customer } from "./Customer";
import type { Employee } from "./Employee";
import type { BookingDetail } from "./BookingDetail";
