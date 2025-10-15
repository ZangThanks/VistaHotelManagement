package com.hotelvista.repository;

import com.hotelvista.model.RoomTypePromotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RoomTypePromotionRepository extends JpaRepository<RoomTypePromotion, RoomTypePromotion.RoomTypePromotionId> {

    List<RoomTypePromotion> findAllByStartDateAfterAndEndDateBefore(LocalDate startDateAfter, LocalDate endDateBefore);

}
