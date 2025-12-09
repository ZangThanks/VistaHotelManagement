package com.hotelvista.repository;

import com.hotelvista.dto.RevenueReportProjection;
import com.hotelvista.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RevenueReportRepository extends JpaRepository<Report, String> {

    /**
     * Thong ke doanh thu hang ngay trong mot khoang thoi gian
     *
     * @param fromDate Ngay bat dau
     * @param toDate   Ngay ket thuc
     * @return Danh sach RevenueReportProjection chua du lieu doanh thu hang ngay
     */
    @Query(value = """
                SELECT
                    YEAR(booking_date) AS year,
                    MONTH(booking_date) AS month,
                    DAY(booking_date) AS day,
                    COUNT(*) AS bookingCount,
                    SUM(total_amount) AS roomRevenue,
                    SUM(total_cost) AS serviceRevenue,
                    SUM(total_amount + total_cost) AS totalRevenue
                FROM bookings
                WHERE booking_date BETWEEN :fromDate AND :toDate
                  AND status = 'CHECKED_OUT'
                GROUP BY YEAR(booking_date), MONTH(booking_date), DAY(booking_date)
                ORDER BY year, month, day
            """, nativeQuery = true)
    List<RevenueReportProjection> getDaily(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );

    /**
     * Thong ke doanh thu hang tuan trong mot khoang thoi gian
     *
     * @param fromDate Ngay bat dau
     * @param toDate   Ngay ket thuc
     * @return Danh sach RevenueReportProjection chua du lieu doanh thu hang ngay
     */
    @Query(value = """
                SELECT
                    YEAR(booking_date) AS year,
                    MONTH(booking_date) AS month,
                    WEEK(booking_date, 1) AS week,
                    COUNT(*) AS bookingCount,
                    SUM(total_amount) AS roomRevenue,
                    SUM(total_cost) AS serviceRevenue,
                    SUM(total_amount + total_cost) AS totalRevenue
                FROM bookings
                WHERE booking_date BETWEEN :fromDate AND :toDate
                  AND status = 'CHECKED_OUT'
                GROUP BY YEAR(booking_date), MONTH(booking_date), WEEK(booking_date, 1)
                ORDER BY year, month, week
            """, nativeQuery = true)
    List<RevenueReportProjection> getWeeklyOfMonth(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );

    /**
     * Thong ke doanh thu hang thang trong mot nam
     *
     * @param year Nam can thong ke
     * @return Danh sach RevenueReportProjection chua du lieu doanh thu hang thang
     */

    @Query(value = """
                SELECT
                    YEAR(booking_date) AS year,
                    MONTH(booking_date) AS month,
                    COUNT(*) AS bookingCount,
                    SUM(total_amount) AS roomRevenue,
                    SUM(total_cost) AS serviceRevenue,
                    SUM(total_amount + total_cost) AS totalRevenue
                FROM bookings
                WHERE YEAR(booking_date) = :year
                  AND status = 'CHECKED_OUT'
                GROUP BY YEAR(booking_date), MONTH(booking_date)
                ORDER BY month
            """, nativeQuery = true)
    List<RevenueReportProjection> getMonthlyByYear(
            @Param("year") int year
    );

    /**
     * Thong ke doanh thu hang quy trong mot nam
     *
     * @param year Nam can thong ke
     * @return Danh sach RevenueReportProjection chua du lieu doanh thu hang quy
     */

    @Query(value = """
                SELECT
                    YEAR(booking_date) AS year,
                    QUARTER(booking_date) AS quarter,
                    COUNT(*) AS bookingCount,
                    SUM(total_amount) AS roomRevenue,
                    SUM(total_cost) AS serviceRevenue,
                    SUM(total_amount + total_cost) AS totalRevenue
                FROM bookings
                WHERE YEAR(booking_date) = :year
                  AND status = 'CHECKED_OUT'
                GROUP BY YEAR(booking_date), QUARTER(booking_date)
                ORDER BY quarter
            """, nativeQuery = true)
    List<RevenueReportProjection> getQuarterlyByYear(
            @Param("year") int year
    );

    /**
     * Thong ke doanh thu hang nam
     *
     * @return Danh sach RevenueReportProjection chua du lieu doanh thu hang nam
     */
    @Query(value = """
                SELECT
                    YEAR(booking_date) AS year,
                    COUNT(*) AS bookingCount,
                    SUM(total_amount) AS roomRevenue,
                    SUM(total_cost) AS serviceRevenue,
                    SUM(total_amount + total_cost) AS totalRevenue
                FROM bookings
                WHERE status = 'CHECKED_OUT'
                GROUP BY YEAR(booking_date)
                ORDER BY year
            """, nativeQuery = true)
    List<RevenueReportProjection> getYearly();

    /**
     * Thống kê doanh thu theo từng ngày trong khoảng thời gian
     */
    @Query(value = """
                SELECT
                    DATE(booking_date) AS date,
                    COUNT(*) AS bookingCount,
                    SUM(total_amount) AS roomRevenue,
                    SUM(total_cost) AS serviceRevenue,
                    SUM(total_amount + total_cost) AS totalRevenue
                FROM bookings
                WHERE booking_date BETWEEN :fromDate AND :toDate
                  AND status = 'CHECKED_OUT'
                GROUP BY DATE(booking_date)
                ORDER BY DATE(booking_date)
            """, nativeQuery = true)
    List<RevenueReportProjection> getRevenueByDateRange(
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate
    );


}

