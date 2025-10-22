package com.hotelvista.repository;

import com.hotelvista.model.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingServiceRepository extends JpaRepository<BookingService, BookingService.BookingServiceId> {

    /**
     * Tìm tất cả bookingService theo bookingId
     *
     * @param bookingBookingID
     * @return
     */
    List<BookingService> findAllByBooking_BookingID(String bookingBookingID);

}
