package com.hotelvista.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingReportDTO {
    private String period; // Jan 2024, Week 1, Q1 2024...
    private Long totalBookings;
    private Long completedBookings;
    private Long cancelledBookings;
    private Double cancellationRate; // Percentage
    private Double averageBookingValue; // Average total amount
    private Double totalRevenue;
}
