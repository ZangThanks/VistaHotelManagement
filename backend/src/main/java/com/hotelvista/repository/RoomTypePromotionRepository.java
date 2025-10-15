package com.hotelvista.repository;

import com.hotelvista.model.RoomTypePromotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomTypePromotionRepository extends JpaRepository<RoomTypePromotion, RoomTypePromotion.RoomTypePromotionId> {
}
