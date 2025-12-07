package com.hotelvista.repository;

import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, String> {

    /**
     * Tìm tất cả booking có bookingDate trong khoảng
     *
     * @param bookingDateAfter
     * @param bookingDateBefore
     * @return
     */
    List<Booking> findAllByBookingDateBetween(LocalDateTime bookingDateAfter, LocalDateTime bookingDateBefore);

    /**
     * Tìm booking theo mã khách hàng
     *
     * @param customerId
     * @return
     */
    List<Booking> findAllByCustomer_Id(String customerId);

    /**
     * Tìm booking theo tiêu chí mã booking, tên khách hàng, hoặc số điện thoại
     * @param keyword
     * @return
     */
    @Query("""
        SELECT b FROM Booking b 
            WHERE b.bookingID = :keyword OR b.customer.phone LIKE %:keyword% OR
            LOWER(b.customer.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        """)
    List<Booking> searchBookings(@Param("keyword") String keyword);


    //B1109250001
    /**
     * Tìm số thứ tự lớn nhất của booking trong ngày hôm nay
     * @param todayPrefix
     * @return
     */
    @Query("SELECT MAX(CAST(SUBSTRING(b.bookingID, 8) AS int)) FROM Booking b WHERE b.bookingID LIKE CONCAT(:todayPrefix, '%')")
    Integer findMaxSequenceForToday(@Param("todayPrefix") String todayPrefix);

    @Query("SELECT b FROM Booking b " +
            "JOIN BookingDetail bd ON b.bookingID = bd.booking.bookingID " +
            "WHERE bd.room.roomNumber = :roomNumber")
    List<Booking> findAllByRoom_RoomNumber(@Param("roomNumber") String roomNumber);

    /**
     * Tìm bookings theo khoảng ngày check-in
     * @param startDate
     * @param endDate
     * @return
     */
    List<Booking> findAllByCheckInDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Tìm booking theo ngày check-out
     * @param startDate
     * @param endDate
     * @return
     */
    List<Booking> findAllByCheckOutDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT CASE WHEN COUNT(bd) > 0 THEN true ELSE false END " +
            "FROM BookingDetail bd " +
            "JOIN bd.room r " +
            "JOIN r.roomType rt " +
            "JOIN rt.seasonalPrices sp " +
            "WHERE sp.id = :id")
    boolean existsBookingsBySeasonalPrice(@Param("id") Integer id);

    /**
     * Tìm các booking bị trung với khoảng thời gian check-in/check-out cho một phòng cụ thể
     * @param roomNumber Số phòng
     * @param checkIn Thời gian check-in mới
     * @param checkOut Thời gian check-out mới
     * @return Danh sách booking bị trùng
     */
    @Query("SELECT b FROM Booking b " +
            "JOIN b.bookingDetails bd " +
            "WHERE bd.room.roomNumber = :roomNumber " +
            "AND b.status NOT IN ('CANCELLED', 'CHECKED_OUT') " +
            "AND NOT (b.checkOutDate <= :checkIn OR b.checkInDate >= :checkOut)")
    List<Booking> findConflictingBookings(
            @Param("roomNumber") String roomNumber,
            @Param("checkIn") LocalDateTime checkIn,
            @Param("checkOut") LocalDateTime checkOut
    );
}
