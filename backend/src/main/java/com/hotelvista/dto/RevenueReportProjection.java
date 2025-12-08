package com.hotelvista.dto;

public interface RevenueReportProjection {

    Integer getYear();
    String getDate();
    Integer getMonth();
    Integer getWeek();
    Integer getQuarter();
    Integer getDay();
    Double getBookingCount();
    Double getRoomRevenue();
    Double getServiceRevenue();
    Double getTotalRevenue();
}
