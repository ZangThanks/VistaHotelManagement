// java
package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hotelvista.model.enums.ApprovalStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @JsonIgnoreProperties({"earlyCheckin", "hibernateLazyInitializer", "handler"})
    @ToString.Exclude
    private Booking booking;

    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "employee_id")
    private Employee employee;
}
