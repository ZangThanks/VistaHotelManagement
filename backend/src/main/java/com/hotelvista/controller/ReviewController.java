package com.hotelvista.controller;

import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.model.Review;
import com.hotelvista.model.Room;
import com.hotelvista.service.BookingDetailService;
import com.hotelvista.service.BookingService;
import com.hotelvista.service.ReviewService;
import com.hotelvista.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private BookingDetailService bookingDetailService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RoomService roomService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("")
    public List<Review> getAll() {
        return reviewService.findAll();
    }

    @GetMapping("/{id}")
    public Review findById(@PathVariable String id) {
        return reviewService.findById(id);
    }

    @GetMapping("/room/{roomNumber}")
    public List<Review> getReviewsByRoomNumber(@PathVariable String roomNumber) {
        return reviewService.getReviewByRoomNumber(roomNumber);
    }

    @PostMapping("/save/{bookingId}/{roomNumber}")
    public boolean saveReview(@RequestBody Review review, @PathVariable String bookingId, @PathVariable String roomNumber) {
        return reviewService.addReview(review, bookingId, roomNumber);
    }
}
