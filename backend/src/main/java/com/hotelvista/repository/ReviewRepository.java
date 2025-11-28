package com.hotelvista.repository;

import com.hotelvista.dto.CustomerReviewDTO;
import com.hotelvista.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    /**
     * Get reviews by room ID
     * @param roomID
     * @return
     */
    @Query("""
    SELECT new com.hotelvista.dto.CustomerReviewDTO(c, r)
    FROM BookingDetail bdl
    JOIN bdl.booking b
    JOIN b.customer c
    JOIN bdl.review r
    WHERE bdl.room.roomNumber = :roomID
""")
    List<CustomerReviewDTO> getReviewByRoomID(String roomID);


}
