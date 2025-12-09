package com.hotelvista.scheduler;

import com.hotelvista.model.Booking;
import com.hotelvista.model.enums.BookingStatus;
import com.hotelvista.model.enums.PaymentStatus;
import com.hotelvista.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingAutoCancelTask {
    private final BookingRepository bookingRepository;

    // Chạy mỗi 5 phút
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void autoCancelExpiredBookings() {
        LocalDateTime now = LocalDateTime.now();

        // Hủy booking WAITING quá 8 giờ
        List<Booking> expiredBookings_8Hours = bookingRepository.findAllByStatusAndBookingDate(BookingStatus.WAITING,
                now.minusHours(8)
                //now.minusMinutes(8)
        );
        expiredBookings_8Hours.forEach(b -> {
            if (b.getCustomer().getReputationPoint() > 40 && b.getCustomer().getReputationPoint() <= 70) {
                b.setStatus(BookingStatus.CANCELLED);
                b.setPaymentStatus(PaymentStatus.FAILED);
            }
        });

        // Hủy booking WAITING quá 6 giờ
        List<Booking> expiredBookings_6Hours = bookingRepository.findAllByStatusAndBookingDate(BookingStatus.WAITING,
                now.minusHours(6)
                //now.minusMinutes(1)
        );
        expiredBookings_6Hours.forEach(b -> {
            if (b.getCustomer().getReputationPoint() >= 0 && b.getCustomer().getReputationPoint() <= 40) {
                b.setStatus(BookingStatus.CANCELLED);
                b.setPaymentStatus(PaymentStatus.FAILED);
            }
        });

        bookingRepository.saveAll(expiredBookings_8Hours);
        bookingRepository.saveAll(expiredBookings_6Hours);

        System.out.println("Auto canceled bookings: " + expiredBookings_6Hours.size());
        System.out.println("Auto canceled bookings: " + expiredBookings_8Hours.size());
    }
}
