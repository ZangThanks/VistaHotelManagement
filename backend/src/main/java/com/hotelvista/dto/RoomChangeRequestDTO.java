package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomChangeRequestDTO {
    private String bookingId;
    private String currentRoomNumber;
    private String newRoomNumber;
    private String reason;
}
