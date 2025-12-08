package com.hotelvista.repository;

import com.hotelvista.dto.promotion.DiscountPromotionDTO;
import com.hotelvista.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface RoomTypeRepository extends JpaRepository<RoomType, String> {

    /**
     * Tính giá khi đã áp dụng tăng giá theo mùa
     *
     * @param roomTypeId
     * @param bookingDate
     * @return
     */
    @Query("SELECT rt.basePrice * sp.priceMultiplier " +
            "FROM RoomType rt JOIN rt.seasonalPrices sp " +
            "WHERE rt.roomTypeID = :roomTypeId " +
            "   AND sp.startDate <= :bookingDate " +
            "   AND sp.endDate >= :bookingDate")
    Double calculateDiscountedPrice(@Param("roomTypeId") String roomTypeId,
                                    @Param("bookingDate") LocalDate bookingDate);

    @Query("""
        SELECT new com.hotelvista.dto.promotion.DiscountPromotionDTO(
            rt.roomTypeID,
            rtp.promotion.promotionID,
            rtp.promotion.discountType,
            rtp.discountValue
        )
        FROM RoomType rt
        JOIN rt.roomTypePromotions rtp
        JOIN rtp.promotion dp
        WHERE rt.roomTypeID = :roomTypeID
          AND rtp.startDate <= :currentDateTime
          AND rtp.endDate >= :currentDateTime
          AND rtp.promotion.isActive = true
    """)
    List<DiscountPromotionDTO> findDiscountPromotionsByRoomTypeID(String roomTypeID, LocalDate currentDateTime);
}
