package com.hotelvista.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum RoomStatus {
    AVAILABLE("AVAILABLE"),
    BOOKED("BOOKED"),
    CLEANING("CLEANING"),
    MAINTENANCE("MAINTENANCE");

    private String roomStatus;
}
