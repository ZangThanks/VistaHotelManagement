package com.hotelvista.repository;

import com.hotelvista.model.RoomTypePromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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

}
