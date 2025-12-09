package com.hotelvista.repository;

import com.hotelvista.model.RoomTypePromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface RoomTypePromotionRepository extends JpaRepository<RoomTypePromotion, RoomTypePromotion.RoomTypePromotionId> {

    /**
     * Tìm các khuyến mãi và loại phòng tương ứng từ startDateAfter đến endDateBefore
     *
     * @param startDateAfter
     * @param endDateBefore
     * @return
     */
    List<RoomTypePromotion> findAllByStartDateAfterAndEndDateBefore(LocalDate startDateAfter, LocalDate endDateBefore);

    @Modifying
    @Transactional
    @Query("DELETE FROM RoomTypePromotion rtp WHERE rtp.promotion.promotionID = :promotionID")
    void deleteByPromotionPromotionID(@Param("promotionID") String promotionID);

    List<RoomTypePromotion> findByPromotion_PromotionID(String promotionPromotionID);
}
