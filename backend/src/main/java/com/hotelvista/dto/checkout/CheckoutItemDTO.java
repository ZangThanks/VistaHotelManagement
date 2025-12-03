package com.hotelvista.dto.checkout;

import com.hotelvista.model.enums.BookingStatus;
import com.hotelvista.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutItemDTO {
    private String bookingId;
    private GuestInfoDTO guestInfo;
    private String roomNumber;
    private String roomType;
    private LocalDateTime checkoutTime;
    private BookingStatus status;
    private TrustScoreDTO trustScore;
    private double balanceDue;
    private PaymentStatus paymentStatus;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class GuestInfoDTO {
    private String name;
    private String email;
    private String phone;
    private String image;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class TrustScoreDTO {
    private int score;
    private String level; // "high", "medium", "low"
}