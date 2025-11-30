package com.hotelvista.controller;

import com.hotelvista.dto.CustomerReviewDTO;
import com.hotelvista.model.Review;
import com.hotelvista.service.ReviewService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("reviews")

public class ReviewController {
    private ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/room/{roomNumber}")
    public List<CustomerReviewDTO> getReviewsByRoomNumber(@PathVariable String roomNumber) {
        return reviewService.getReviewByRoomNumber(roomNumber);
    }

}
