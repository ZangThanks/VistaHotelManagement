package com.hotelvista.repository;

import com.hotelvista.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

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
}
