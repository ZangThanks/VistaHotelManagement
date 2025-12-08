package com.hotelvista.repository;

import com.hotelvista.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface ReportRepository extends JpaRepository<Report, String> {
    // Dashboard Statistics
    @Query(value = """
        SELECT 
            COALESCE(SUM(b.total_amount), 0) as totalRevenue,
            COUNT(DISTINCT b.booking_id) as totalBookings,
            COUNT(DISTINCT b.customer_id) as totalGuests
        FROM bookings b
        WHERE b.booking_date >= :startDate 
        AND b.booking_date < :endDate
        AND b.status != 'CANCELLED'
        """, nativeQuery = true)
    Map<String, Object> getDashboardStats(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query(value = """
        SELECT 
            COALESCE(SUM(b.total_amount), 0) as revenue
        FROM bookings b
        WHERE b.booking_date >= :startDate 
        AND b.booking_date < :endDate
        AND b.status != 'CANCELLED'
        """, nativeQuery = true)
    Double getRevenueByPeriod(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Room Statistics
    @Query(value = """
        SELECT 
            r.status,
            COUNT(*) as count
        FROM rooms r
        GROUP BY r.status
        """, nativeQuery = true)
    List<Map<String, Object>> getRoomStatusDistribution();

    // Occupancy Rate
    @Query(value = """
        SELECT 
            ROUND((COUNT(DISTINCT CASE WHEN r.status = 'BOOKED' THEN r.room_number END) * 100.0 / 
            COUNT(DISTINCT r.room_number)), 2) as occupancyRate
        FROM rooms r
        """, nativeQuery = true)
    Double getOccupancyRate();

    // Revenue Trend (Last 6 months)
    @Query(value = """
        SELECT 
            DATE_FORMAT(b.booking_date, '%Y-%m') as month,
            COALESCE(SUM(b.total_amount), 0) as revenue,
            COUNT(b.booking_id) as bookings
        FROM bookings b
        WHERE b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        AND b.status != 'CANCELLED'
        GROUP BY DATE_FORMAT(b.booking_date, '%Y-%m')
        ORDER BY month
        """, nativeQuery = true)
    List<Map<String, Object>> getRevenueTrend();

    // Daily Occupancy (Last 7 days)
    @Query(value = """
        SELECT 
            DAYNAME(date_series.date) as day,
            ROUND(COALESCE(
                (SELECT COUNT(DISTINCT bd.room_number) * 100.0 / 
                (SELECT COUNT(*) FROM rooms)
                FROM booking_details bd
                INNER JOIN bookings b ON bd.booking_id = b.booking_id
                WHERE b.check_in_date <= date_series.date 
                AND b.check_out_date > date_series.date
                AND b.status IN ('CHECKED_IN', 'CHECKED_OUT')), 0), 2) as rate
        FROM (
            SELECT DATE_SUB(CURDATE(), INTERVAL 6 DAY) as date UNION ALL
            SELECT DATE_SUB(CURDATE(), INTERVAL 5 DAY) UNION ALL
            SELECT DATE_SUB(CURDATE(), INTERVAL 4 DAY) UNION ALL
            SELECT DATE_SUB(CURDATE(), INTERVAL 3 DAY) UNION ALL
            SELECT DATE_SUB(CURDATE(), INTERVAL 2 DAY) UNION ALL
            SELECT DATE_SUB(CURDATE(), INTERVAL 1 DAY) UNION ALL
            SELECT CURDATE()
        ) as date_series
        ORDER BY date_series.date
        """, nativeQuery = true)
    List<Map<String, Object>> getDailyOccupancy();

    // Room Type Distribution
    @Query(value = """
        SELECT 
            rt.type_name as name,
            COUNT(r.room_number) as count
        FROM room_types rt
        LEFT JOIN rooms r ON rt.room_type_id = r.room_type_id
        GROUP BY rt.room_type_id, rt.type_name
        """, nativeQuery = true)
    List<Map<String, Object>> getRoomTypeDistribution();

    // Booking Status Distribution
    @Query(value = """
        SELECT 
            b.status,
            COUNT(*) as count
        FROM bookings b
        WHERE b.booking_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        GROUP BY b.status
        """, nativeQuery = true)
    List<Map<String, Object>> getBookingStatusDistribution();

    // Popular Services
    @Query(value = """
        SELECT 
            s.service_name as name,
            COALESCE(SUM(bs.quantity), 0) as orders,
            COALESCE(SUM(bs.total_amount), 0) as revenue
        FROM services s
        LEFT JOIN booking_services bs ON s.service_id = bs.service_id
        WHERE bs.booking_id IN (
            SELECT booking_id FROM bookings 
            WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        )
        GROUP BY s.service_id, s.service_name
        ORDER BY orders DESC
        LIMIT 10
        """, nativeQuery = true)
    List<Map<String, Object>> getPopularServices();

    // Check-in/Check-out Today
    @Query(value = """
        SELECT COUNT(*) FROM bookings
        WHERE DATE(check_in_date) = CURDATE()
        AND status = 'PENDING'
        """, nativeQuery = true)
    Integer getPendingCheckInsToday();

    @Query(value = """
        SELECT COUNT(*) FROM bookings
        WHERE DATE(check_out_date) = CURDATE()
        AND status = 'CHECKED_IN'
        """, nativeQuery = true)
    Integer getPendingCheckOutsToday();

    // Average Rating
    @Query(value = """
        SELECT 
            COALESCE(AVG(r.rating), 0) as avgRating,
            COUNT(*) as totalReviews
        FROM reviews r
        INNER JOIN booking_details bd ON r.review_id = bd.review_id
        WHERE r.review_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        """, nativeQuery = true)
    Map<String, Object> getAverageRating();
}
