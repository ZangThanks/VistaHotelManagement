package com.hotelvista.controller;

import com.hotelvista.model.Review;
import com.hotelvista.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("reviews")

public class ReviewController {
    private ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/room/{roomNumber}")
    public List<Review> getReviewsByRoomNumber(@PathVariable String roomNumber) {
        return reviewService.getReviewByRoomNumber(roomNumber);
    }

    @PostMapping("/save")
    public boolean saveReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }
}
