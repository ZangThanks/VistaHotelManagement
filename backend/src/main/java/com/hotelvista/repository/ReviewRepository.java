package com.hotelvista.repository;

import com.hotelvista.dto.CustomerReviewDTO;
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
    @Query("""
    SELECT new com.hotelvista.dto.CustomerReviewDTO(c, r)
    FROM BookingDetail bdl
    JOIN bdl.booking b
    JOIN b.customer c
    JOIN bdl.review r
    WHERE bdl.room.roomNumber = :roomID
""")
    List<CustomerReviewDTO> getReviewByRoomID(String roomID);

    /**
     * Tìm số thứ tự lớn nhất của booking trong ngày hôm nay
     * @param todayPrefix
     * @return
     */
    @Query("SELECT MAX(CAST(SUBSTRING(r.reviewID, 8) AS int)) FROM Review r WHERE r.reviewID LIKE CONCAT(:todayPrefix, '%')")
    Integer findMaxSequenceForToday(@Param("todayPrefix") String todayPrefix);

    // Average rating theo tháng
    @Query("""
    SELECT 
        FUNCTION('DATE_FORMAT', r.reviewDate, '%Y-%m'),
        AVG(r.rating)
    FROM Review r
    GROUP BY FUNCTION('DATE_FORMAT', r.reviewDate, '%Y-%m')
    ORDER BY FUNCTION('DATE_FORMAT', r.reviewDate, '%Y-%m')
    """)
    List<Object[]> getAverageRatingByMonth();

    // Rating trung bình theo từng tiêu chí
    @Query("""
    SELECT 
        AVG(r.location),
        AVG(r.serviceQuality),
        AVG(r.roomQuantity),
        AVG(r.valueForMoney)
    FROM Review r
    """)
    List<Object[]> getCategoryRatingsRaw();




    // Sentiment Analysis (Positive / Neutral / Negative)
    @Query("""
        SELECT 
            SUM(CASE WHEN r.rating >= 4 THEN 1 ELSE 0 END), 
            SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END),   
            SUM(CASE WHEN r.rating <= 2 THEN 1 ELSE 0 END)   
        FROM Review r
    """)
    List<Object[]> getSentimentStats();

}
