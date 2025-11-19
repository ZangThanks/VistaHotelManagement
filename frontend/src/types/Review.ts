import type { BookingDetail } from "./BookingDetail";

export interface Review {
  reviewID: string;
  rating: number;
  roomQuantity: number;
  serviceQuality: number;
  location: number;
  valueForMoney: number;
  comment: string;
  reviewDate: string;
  isAnonymous: boolean;
  images: string[];
  bookingDetail: BookingDetail;
}
