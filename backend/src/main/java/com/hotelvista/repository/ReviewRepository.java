package com.hotelvista.repository;

import com.hotelvista.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    /**
     * Get reviews by room ID
     * @param roomID
     * @return
     */
    @Query(value = """
            SELECT r.* 
            FROM booking_details bdl
            JOIN reviews r ON bdl.review_id = r.review_id
            WHERE bdl.room_id = :roomID
            """, nativeQuery = true)
    List<Review> getReviewByRoomID(String roomID);

}
