export interface Booking {
  bookingID: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: string;
  specialRequests: string;
  bookingDate: string;
  packageType: string;
  totalAmount: number;
  paymentStatus: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  bookingDetails: Array<{
    room: {
      roomNumber: string;
      floor: number;
      status: string;
    };
    roomPrice: number;
  }>;
}
