package com.hotelvista.repository;

import com.hotelvista.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, String> {

    List<Promotion> findAllByActive(boolean active);

    List<Promotion> findAllByPromotionNameContainingIgnoreCase(String promotionName);

}
