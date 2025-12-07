package com.hotelvista.dto;

public interface RevenueReportProjection {

    Integer getYear();
    Integer getMonth();
    Integer getWeek();
    Integer getDay();
    Double getBookingCount();
    Double getRoomRevenue();
    Double getServiceRevenue();
    Double getTotalRevenue();
}
