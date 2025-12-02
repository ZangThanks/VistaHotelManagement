package com.hotelvista.service;

import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.model.Review;
import com.hotelvista.model.Room;
import com.hotelvista.repository.BookingDetailRepository;
import com.hotelvista.repository.BookingRepository;
import com.hotelvista.repository.ReviewRepository;
import com.hotelvista.repository.RoomRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository repo;

    @Autowired
    private BookingDetailRepository detailRepo;

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private RoomRepository roomRepo;

    @Transactional(readOnly = true)
    public List<Review> findAll() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public Review findById(String id) {
        return repo.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewByRoomNumber(String roomNumber) {
        return repo.getReviewByRoomID(roomNumber);
    }

    @Transactional
    public boolean addReview(Review review, String bookingID, String roomNumber) {
        try {
            Room room = roomRepo.findById(roomNumber)
                    .orElseThrow(() -> new Exception("Room not found"));

            Booking booking = bookingRepo.findById(bookingID)
                    .orElseThrow(() -> new Exception("Booking not found"));

            BookingDetail.BookingDetailId id = new BookingDetail.BookingDetailId(room, booking);
            BookingDetail bookingDetail = detailRepo.findById(id)
                    .orElseThrow(() -> new Exception("Booking detail not found"));

            review.setReviewID(generateBookingID());
            review.setReviewDate(LocalDateTime.now());
            
            Review savedReview = repo.save(review);
            bookingDetail.setReview(savedReview);
            detailRepo.save(bookingDetail);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public String generateBookingID() {
        LocalDate today = LocalDate.now();
        String prefix = "R" + today.format(DateTimeFormatter.ofPattern("ddMMyy")); // R110925

        Integer maxSequence = repo.findMaxSequenceForToday(prefix);
        int nextSequence = (maxSequence == null) ? 1 : maxSequence + 1;

        return prefix + String.format("%04d", nextSequence); // R1109250001
    }
}
