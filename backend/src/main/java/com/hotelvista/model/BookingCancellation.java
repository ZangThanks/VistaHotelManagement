package com.hotelvista.model;

import com.hotelvista.model.enums.RefundMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "booking_cancellations")
public class BookingCancellation {
    
    @Id
    @Column(name = "cancellation_id")
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "cancel_reason", columnDefinition = "NVARCHAR(500)")
    private String cancelReason;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "refund_amount")
    private Double refundAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "refund_method")
    private RefundMethod refundMethod;

    @Column(name = "refund_account_info", columnDefinition = "NVARCHAR(255)")
    private String refundAccountInfo;
}
