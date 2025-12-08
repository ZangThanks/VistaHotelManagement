package com.hotelvista.repository;

import com.hotelvista.dto.RevenueReportDTO;
import com.hotelvista.dto.RevenueReportProjection;
import com.hotelvista.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, String> {
    @Query(value = """
                SELECT
                    YEAR(booking_date)  AS year,
                    MONTH(booking_date) AS month,
                    COUNT(*) AS bookingCount,
                    SUM(total_amount) AS roomRevenue,
                    SUM(total_cost) AS serviceRevenue,
                    SUM(total_amount + total_cost) AS totalRevenue
                FROM bookings
                WHERE booking_date IS NOT NULL
                  AND status = 'CHECKED_OUT'
                GROUP BY YEAR(booking_date), MONTH(booking_date)
                ORDER BY year, month;
            """, nativeQuery = true)
    List<RevenueReportProjection> getAll();
    


}
