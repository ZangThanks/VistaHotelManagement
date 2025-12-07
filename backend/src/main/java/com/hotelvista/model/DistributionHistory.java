package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "distribution_history")
public class DistributionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @Column(columnDefinition = "TEXT")
    private String criteria;

    private Integer recipientCount;

    private LocalDateTime distributedAt;

    @Column(length = 20)
    private String status; // "success" or "failed"

    @PrePersist
    protected void onCreate() {
        distributedAt = LocalDateTime.now();
    }
}
