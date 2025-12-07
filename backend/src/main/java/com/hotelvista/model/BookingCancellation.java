package com.hotelvista.model;

import com.hotelvista.model.enums.RefundMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "booking_cancellations")
public class BookingCancellation {

    @Id
    private String id;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "cancel_reason", columnDefinition = "NVARCHAR(255)")
    private String cancelReason;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "refund_amount")
    private Double refundAmount;

    @Column(name = "refund_method")
    @Enumerated(EnumType.STRING)
    private RefundMethod refundMethod;

    @Column(name = "refund_account_info", columnDefinition = "LONGTEXT")
    private String refundAccountInfo;
}

