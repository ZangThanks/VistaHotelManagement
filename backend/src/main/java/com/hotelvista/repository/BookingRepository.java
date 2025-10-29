package com.hotelvista.repository;

import com.hotelvista.model.Booking;
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
         WHERE b.bookingID = :keyword OR
         b.customer.phone LIKE %:keyword% OR
          LOWER(b.customer.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) 
        """)
    List<Booking> searchBookings(@Param("keyword") String keyword);
}
