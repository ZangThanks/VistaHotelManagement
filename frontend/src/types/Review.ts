import type { BookingDetail } from "./BookingDetail";

export interface Review {
  reviewID: string;
  rating: number;
  roomQuality: number;
  serviceQuality: number;
  location: number;
  valueForMoney: number;
  comment: string;
  reviewDate: Date;
  isAnonymous: boolean;
  images: string[];
  bookingDetail: BookingDetail;
}
