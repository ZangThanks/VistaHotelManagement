package com.hotelvista.repository;

import com.hotelvista.model.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingServiceRepository extends JpaRepository<BookingService, BookingService.BookingServiceId> {

    /**
     * Tìm tất cả bookingService theo bookingId
     *
     * @param bookingBookingID
     * @return
     */
    List<BookingService> findAllByBooking_BookingID(String bookingBookingID);

    /**
     * Tìm tất cả booking services trong khoảng thời gian
     * Lấy tất cả service đã được đặt trong khoảng thời gian
     */
    @Query("SELECT bs FROM BookingService bs WHERE DATE(bs.booking.checkInDate) >= :startDate AND DATE(bs.booking.checkInDate) <= :endDate")
    List<BookingService> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

}
