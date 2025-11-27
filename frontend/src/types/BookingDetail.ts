import type { Review } from "./Review";
import type { Room } from "./Room";

export interface BookingDetail {
    room: Room;
    bookingID: string;
    roomPrice: number;
    review: Review;
}
