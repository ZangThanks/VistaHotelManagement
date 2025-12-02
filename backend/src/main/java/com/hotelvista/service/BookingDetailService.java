package com.hotelvista.service;

import com.hotelvista.model.BookingDetail;
import com.hotelvista.model.Review;
import com.hotelvista.repository.BookingDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
public class BookingDetailService {
    @Autowired
    private BookingDetailRepository repo;

    public List<BookingDetail> findAll() {
        return repo.findAll();
    }

    public BookingDetail findById(BookingDetail.BookingDetailId id) {


        return repo.findById(id).orElse(null);
    }

    public boolean save(BookingDetail bookingDetail) {
        return repo.save(bookingDetail) != null;
    }

    public List<BookingDetail> findAllByBooking_BookingID(String bookingBookingID) {
        return repo.findAllByBooking_BookingID(bookingBookingID);
    }

    @Transactional(readOnly = true)
    public List<LocalDateTime> findOverlappingBookings(String roomNumber) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime end = now.plusMonths(6); //check trong 6 tháng tới

        List<BookingDetail> list = repo.findOverlappingBookings(roomNumber, now, end);

        return list.stream().flatMap(bd -> {
            LocalDateTime checkIn = bd.getBooking().getCheckInDate();
            LocalDateTime checkOut = bd.getBooking().getCheckOutDate();

            //return checkIn.datesUntil(checkOut.plusDays(1)); LocalDate
            return Stream.iterate(checkIn, d -> d.isBefore(checkOut), d -> d.plusDays(1)); //LocalDateTime
        }).toList();
    }
}
