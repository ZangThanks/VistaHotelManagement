package com.hotelvista.repository;

import com.hotelvista.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String> {

    List<Booking> findAllByBookingDateBetween(LocalDateTime bookingDateAfter, LocalDateTime bookingDateBefore);

    List<Booking> findAllByCustomer_Id(String customerId);

}
