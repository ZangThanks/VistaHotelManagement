package com.hotelvista.controller;

import com.hotelvista.dto.review.BookingRoomDTO;
import com.hotelvista.dto.review.SaveReviewRequest;
import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.dto.CustomerReviewDTO;
import com.hotelvista.model.Review;
import com.hotelvista.model.Room;
import com.hotelvista.service.BookingDetailService;
import com.hotelvista.service.BookingService;
import com.hotelvista.service.ReviewService;
import com.hotelvista.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

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
    public List<CustomerReviewDTO> getReviewsByRoomNumber(@PathVariable String roomNumber) {
        return reviewService.getReviewByRoomNumber(roomNumber);
    }

    @PostMapping("/save/{bookingId}/{roomNumber}")
    public boolean saveReview(@RequestBody SaveReviewRequest request, @PathVariable String bookingId, @PathVariable String roomNumber) {
        System.out.println("=== SAVING REVIEW ===");
        System.out.println("Is Reply: " + (request.getParentReviewId() != null));
        if (request.getParentReviewId() != null) {
            System.out.println("Parent Review ID: " + request.getParentReviewId());
        }
        System.out.println("==================");

        // Convert DTO to Entity
        Review review = new Review();
        review.setReviewID(request.getReviewID());
        review.setRating(request.getRating());
        review.setRoomQuality(request.getRoomQuality());
        review.setServiceQuality(request.getServiceQuality());
        review.setLocation(request.getLocation());
        review.setValueForMoney(request.getValueForMoney());
        review.setComment(request.getComment());
        review.setReviewDate(request.getReviewDate());
        review.setAnonymous(request.isAnonymous());
        review.setFlag(request.isFlag());
        review.setImages(request.getImages());

        // Nếu có parentReviewId, tạo parent review object chỉ với ID
        if (request.getParentReviewId() != null && !request.getParentReviewId().isEmpty()) {
            Review parentReview = new Review();
            parentReview.setReviewID(request.getParentReviewId());
            review.setParentReview(parentReview);
        }

        return reviewService.addReview(review, bookingId, roomNumber);
    }

    // 1. Biểu đồ đường
    @GetMapping("/ratings/trend")
    public ResponseEntity<?> getRatingTrend() {
        return ResponseEntity.ok(reviewService.getRatingTrend());
    }

    // 2. Biểu đồ cột
    @GetMapping("/ratings/category")
    public ResponseEntity<?> getCategoryRatings() {
        return ResponseEntity.ok(reviewService.getCategoryRatings());
    }

    // 3. Biểu đồ tròn
    @GetMapping("/ratings/sentiment")
    public ResponseEntity<?> getSentiment() {
        return ResponseEntity.ok(reviewService.getSentiment());
    }

    @GetMapping("/room/with-customer/{roomNumber}")
    public List<CustomerReviewDTO> findReviewsByRoomNumberWithCustomer(@PathVariable("roomNumber") String roomNumber) {
        return reviewService.findReviewsByRoomNumberWithCustomer(roomNumber);
    }

    @GetMapping("/booking/{reviewID}")
    public BookingRoomDTO findBookingByReview_ReviewID(@PathVariable("reviewID") String reviewID) {
        return reviewService.findBookingByReview_ReviewID(reviewID);
    }
}
