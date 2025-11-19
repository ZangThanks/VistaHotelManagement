package com.hotelvista.model;

import com.hotelvista.model.enums.Prioty;
import com.hotelvista.model.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_requests")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class MaintenanceRequest {
    @Id
    @Column(name = "request_id")
    private String requestID;

    @Column(name = "request_date")
    private LocalDateTime requestDate;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;

    @Enumerated(EnumType.STRING)
    private Prioty prioty;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @Column(name = "estimated_time")
    private int estimatedTime;

    @Column(name = "actual_cost")
    private double actualCost;

    @Column(name = "image_url", columnDefinition = "NVARCHAR(500)")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
