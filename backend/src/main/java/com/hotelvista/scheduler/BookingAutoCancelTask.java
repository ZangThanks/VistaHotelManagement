package com.hotelvista.scheduler;

import com.hotelvista.model.Booking;
import com.hotelvista.model.enums.BookingStatus;
import com.hotelvista.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingAutoCancelTask {
    private final BookingRepository bookingRepository;

    // Chạy mỗi 5 phút
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void autoCancelExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();

        // lấy booking WAITING quá 8 giờ
        List<Booking> expiredBookings = bookingRepository.findAllByStatusAndBookingDate(BookingStatus.WAITING, now.minusHours(8));;


        expiredBookings.forEach(b -> b.setStatus(BookingStatus.CANCELLED));

        bookingRepository.saveAll(expiredBookings);

        System.out.println("Auto canceled bookings: " + expiredBookings.size());
    }
}
