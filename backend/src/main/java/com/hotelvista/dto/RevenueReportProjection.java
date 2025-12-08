package com.hotelvista.dto;

public interface RevenueReportProjection {

    Integer getYear();
    Integer getMonth();
    Double getBookingCount();
    Double getRoomRevenue();
    Double getServiceRevenue();
    Double getTotalRevenue();
}
