package com.hotelvista.repository;

import com.hotelvista.model.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetail.BookingDetailId> {

    /**
     * Tìm bookingDetail theo bookingId
     *
     * @param bookingBookingID
     * @return
     */
    List<BookingDetail> findAllByBooking_BookingID(String bookingBookingID);
}
