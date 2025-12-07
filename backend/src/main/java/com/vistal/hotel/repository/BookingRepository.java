package com.vistal.hotel.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
// ...existing imports...
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // ...existing code...

    // Sum room revenue for bookings between dates (adjust query to your schema if needed)
    @Query("SELECT SUM(b.roomRevenue) FROM Booking b WHERE b.checkInDate BETWEEN :start AND :end")
    BigDecimal sumRoomRevenueByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    // Count bookings between dates
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.checkInDate BETWEEN :start AND :end")
    Integer countByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    // ...existing code...
}

