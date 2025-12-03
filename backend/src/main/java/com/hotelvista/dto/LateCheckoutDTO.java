package com.hotelvista.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LateCheckoutDTO {
    private String requestID;
    private LocalDateTime requestTime;
    private LocalDateTime requestDate;
    private double additionalFee;
    private String approvalStatus;

    private String bookingId;

    private String customerName;
    private String customerEmail;

    private String roomNumber;
    private String roomType;
    private double roomPrice;

    private String checkInDate;
    private String checkOutDate;
}
