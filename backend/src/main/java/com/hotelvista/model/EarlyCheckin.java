package com.hotelvista.model;

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
    private String approvalStatus;

    @Column(name = "additional_fee")
    private double additionalFee;

    @Column(name = "approve_by", columnDefinition = "NVARCHAR(255)")
    private String approveBy;

    @Column(name = "request_date")
    private LocalDateTime requestDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
