package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hotelvista.model.enums.ApprovalStatus;
import com.hotelvista.model.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "early_checkins")
public class EarlyCheckin {
    @Id
    @Column(name = "request_id")
    private String requestID;

    @Column(name = "request_time")
    private LocalDateTime requestTime;

    @Column(name = "approval_status")
    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus;

    @Column(name = "additional_fee")
    private double additionalFee;

    @Column(name = "request_date")
    private LocalDateTime requestDate;

    @OneToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnore
    private Booking booking;

}
