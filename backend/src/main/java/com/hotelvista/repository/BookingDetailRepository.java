package com.hotelvista.repository;

import com.hotelvista.model.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetail.BookingDetailId> {

    /**
     * Tìm bookingDetail theo bookingId
     *
     * @param bookingBookingID
     * @return
     */
    List<BookingDetail> findAllByBooking_BookingID(String bookingBookingID);

    /**
     * Tìm các bookingDetail có thời gian ở với khoảng thời gian cho trước cho một phòng cụ thể
     *
     * @param roomNumber
     * @param checkIn
     * @param checkOut
     * @return
     */
    @Query("SELECT bd FROM  BookingDetail bd WHERE bd.room.roomNumber = :roomNumber " +
            "AND bd.booking.paymentStatus != 'CANCELLED' AND bd.booking.status != 'CANCELLED' " +
            "AND bd.booking.checkInDate < :checkOut " +
            "AND bd.booking.checkOutDate > :checkIn")
    List<BookingDetail> findOverlappingBookings(@Param("roomNumber") String roomNumber,
                                                @Param("checkIn") LocalDateTime checkIn,
                                                @Param("checkOut") LocalDateTime checkOut);
}
