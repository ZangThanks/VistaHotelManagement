package com.vistal.hotel.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
// ...existing imports...
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingServiceRepository extends JpaRepository<BookingServiceEntity, Long> {
    // ...existing code...

    @Query("SELECT SUM(bs.price) FROM BookingServiceEntity bs WHERE bs.booking.checkInDate BETWEEN :start AND :end")
    BigDecimal sumServiceRevenueByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    // ...existing code...
}

