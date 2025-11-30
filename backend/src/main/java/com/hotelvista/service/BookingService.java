package com.hotelvista.service;

import com.hotelvista.exception.BadRequestException;
import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.model.enums.ApprovalStatus;
import com.hotelvista.model.enums.BookingStatus;
import com.hotelvista.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository repo;

    @Transactional(readOnly = true)
    public List<Booking> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Booking findById(String id) {
        return repo.findById(id).orElse(null);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean save(Booking booking) {
        try {
            Booking savedBooking = repo.save(booking);
            if (savedBooking.getBookingDetails() != null) {
                for (BookingDetail detail : savedBooking.getBookingDetails()) {
                    detail.setBooking(booking);
                }
            }
            if (savedBooking.getBookingServices() != null) {
                for (com.hotelvista.model.BookingService bs : savedBooking.getBookingServices()) {
                    bs.setBooking(booking);
                }
            }

            repo.save(booking);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Transactional(readOnly = true)
    public List<Booking> findAllByBookingDateBetween(LocalDateTime bookingDateAfter, LocalDateTime bookingDateBefore) {
        return repo.findAllByBookingDateBetween(bookingDateAfter, bookingDateBefore);
    }

    @Transactional(readOnly = true)
    public List<Booking> findAllByCustomer_Id(String customerId) {
        return repo.findAllByCustomer_Id(customerId);
    }

    @Transactional(readOnly = true)
    public List<Booking> searchBookings(String keyword) {
        return repo.searchBookings(keyword);
    }

    @Transactional
    public String generateBookingID() {
         LocalDate today = LocalDate.now();
         String prefix = "B" + today.format(DateTimeFormatter.ofPattern("ddMMyy")); // B110925
    
        Integer maxSequence = repo.findMaxSequenceForToday(prefix);
        int nextSequence = (maxSequence == null) ? 1 : maxSequence + 1;
    
        return prefix + String.format("%04d", nextSequence); // B1109250001
    }

    @Transactional(readOnly = true)
    public List<Booking> findAllByRoom_RoomNumber(String roomNumber) {
        return repo.findAllByRoom_RoomNumber(roomNumber);
    }
    /**
     * Check-in a booking
     */
    @Transactional
    public Booking checkIn(String bookingId) {

        Booking booking = repo.findById(bookingId)
                .orElseThrow(() -> new BadRequestException("Booking not found: " + bookingId));

        // Validate
        if (booking.getStatus() == BookingStatus.CHECKED_IN) {
            throw new BadRequestException("Booking is already checked in");
        }

        if (booking.getStatus() == BookingStatus.CHECKED_OUT) {
            throw new BadRequestException("Cannot check in a checked out booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot check in a cancelled booking");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime checkInDate = booking.getCheckInDate();

        boolean canCheckIn = false;

        if (now.toLocalDate().isEqual(checkInDate.toLocalDate()) || now.isAfter(checkInDate)) {
            canCheckIn = true;
        }

        if (booking.getEarlyCheckin() != null &&
                booking.getEarlyCheckin().getApprovalStatus() == ApprovalStatus.APPROVED) {

            LocalDateTime earlyCheckInTime = booking.getEarlyCheckin().getRequestDate();

            if (now.isAfter(earlyCheckInTime) || now.isEqual(earlyCheckInTime)) {
                canCheckIn = true;
            }
        }

        if (!canCheckIn) {
            throw new BadRequestException("Check-in time has not arrived yet");
        }

        // Update
        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setActualCheckInTime(now);

        return repo.save(booking);
    }

    public List<Booking> findAllByCheckInDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return repo.findAllByCheckInDateBetween(startDate, endDate);
    }

    public List<Booking> findAllByCheckOutDateBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return repo.findAllByCheckOutDateBetween(startDate, endDate);
    }
}
