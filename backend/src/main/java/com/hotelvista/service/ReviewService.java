package com.hotelvista.service;

import com.hotelvista.dto.CustomerReviewDTO;
import com.hotelvista.model.Review;
import com.hotelvista.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository repo;

    @Transactional(readOnly = true)
    public List<CustomerReviewDTO> getReviewByRoomNumber(String roomNumber) {
        return repo.getReviewByRoomID(roomNumber);
    }

    @Transactional
    public boolean addReview(Review review) {
        try {
            review.setReviewDate(LocalDateTime.now());
            repo.save(review);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}