package com.hotelvista.service;

import com.hotelvista.dto.CustomerReviewDTO;
import com.hotelvista.model.Review;
import com.hotelvista.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private final ReviewRepository repo;

    public ReviewService(ReviewRepository repo) {
        this.repo = repo;
    }
    public List<CustomerReviewDTO> getReviewByRoomNumber(String roomNumber) {
        return repo.getReviewByRoomID(roomNumber);
    }
}
