package com.hotelvista.service;

import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.dto.CustomerReviewDTO;
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
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
    public List<CustomerReviewDTO> getReviewByRoomNumber(String roomNumber) {
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


    /**
     * 1. Average Rating Over Time (Line Chart)
     */
    public List<Map<String, Object>> getRatingTrend() {
        List<Object[]> raw = repo.getAverageRatingByMonth();

        return raw.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("month", row[0]);
            map.put("avgRating", row[1]);
            return map;
        }).toList();
    }

    /**
     * 2. Rating Breakdown by Category (Bar Chart)
     */
    public Map<String, Double> getCategoryRatings() {

        List<Object[]> raw = repo.getCategoryRatingsRaw();

        if (raw == null || raw.isEmpty()) {
            throw new RuntimeException("No review data found!");
        }

        Object[] row = raw.get(0);  // JPQL sẽ trả về 1 dòng duy nhất

        return Map.of(
                "location",      roundNumber(row[0]),
                "service",       roundNumber(row[1]),
                "roomQuality",   roundNumber(row[2]),
                "value",         roundNumber(row[3])
        );
    }



    private double roundNumber(Object obj) {
        if (obj == null) return 0;

        if (obj instanceof Number number) {
            return Math.round(number.doubleValue() * 10.0) / 10.0;
        }

        throw new IllegalArgumentException("Expected Number but got: " + obj.getClass());
    }



    /**
     * 3. Sentiment Analysis (Pie Chart)
     */
    public Map<String, Object> getSentiment() {

        List<Object[]> rawList = repo.getSentimentStats();

        if (rawList == null || rawList.isEmpty()) {
            throw new RuntimeException("No sentiment data found!");
        }

        Object[] raw = rawList.get(0);  // lấy dòng duy nhất

        long positive = ((Number) raw[0]).longValue();
        long neutral  = ((Number) raw[1]).longValue();
        long negative = ((Number) raw[2]).longValue();

        long total = positive + neutral + negative;

        Map<String, Object> map = new HashMap<>();
        map.put("positive", positive);
        map.put("neutral", neutral);
        map.put("negative", negative);

        map.put("positivePercent", total == 0 ? 0 : (positive * 100.0 / total));
        map.put("neutralPercent",  total == 0 ? 0 : (neutral  * 100.0 / total));
        map.put("negativePercent", total == 0 ? 0 : (negative * 100.0 / total));

        return map;
    }

}
