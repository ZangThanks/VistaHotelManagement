package com.hotelvista.dto.review;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingRoomDTO {
    private String bookingId;
    private String roomNumber;
}
